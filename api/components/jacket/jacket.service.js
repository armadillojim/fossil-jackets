module.exports = function(db) {

    const CommonService = require('../common/common.service.js');
    const { verifySignature } = new CommonService(db);

    const checkHashCollision = async (table, hashField, hash) => {
        const countQuery = `select count(*) from ${table} where ${hashField}=$1`;
        const countResult = await db.query(countQuery, [hash]);
        const count = Number(countResult.rows[0].count);
        return (count ? true : false);
    };

    const objectValues = (object, fields) => {
        const l = fields.length;
        const values = Array(l);
        for (var i = 0; i < l; i++) {
            values[i] = object[fields[i]] || null;
        }
        return values;
    };
    const valuesString = (n) => {
        return Array(n).fill(null).map((_, i) => `$${i + 1}`).join(', ');
    };

    const jacketFields = [
        'version',
        'juid',
        'expedition',
        'jacketNumber',
        'created',
        'locality',
        'lat',
        'lng',
        'formation',
        'specimenType',
        'personnel',
        'notes',
        'tid',
        'jhmac',
    ];
    const jacketFieldsString = jacketFields.join(', ');
    const jacketValuesString = valuesString(jacketFields.length);

    const jacketsSelectQuery = `select ${jacketFieldsString}, fullname from jackets join users on users.uid=jackets.juid where seeAlso is null`;
    const getJackets = async () => {
        const jacketsSelectResult = await db.query(jacketsSelectQuery, []);
        if (!jacketsSelectResult.rows.length) { return null; }
        return jacketsSelectResult.rows;
    };

    const jacketSelectQuery = `select ${jacketFieldsString} from jackets where jid=$1 and seeAlso is null`;
    const getJacket = async (jid) => {
        const jacketSelectResult = await db.query(jacketSelectQuery, [jid]);
        if (!jacketSelectResult.rows.length) { return null; }
        return jacketSelectResult.rows[0];
    };

    const jacketSelectByTidQuery = `select jid, ${jacketFieldsString} from jackets where tid=$1 and seeAlso is null`;
    const formatBufferAsSerial = (buf) => buf.toString('hex').toUpperCase().replace(/(..)(?=..)/g, '$1:');
    const tagFromBase64 = (tagBase64) => {
        const tagBuffer = Buffer.from(tagBase64, 'base64');
        return {
            serial: formatBufferAsSerial(tagBuffer.slice(0, 7)),
            version: tagBuffer.readInt16LE(7),
            created: tagBuffer.readInt32LE(9) + 4294967296 * tagBuffer.readInt32LE(13),
            uid: tagBuffer.readInt32LE(17),
            uuid: tagBuffer.slice(21, 37).toString('hex'),
            hmacPayload: tagBuffer.slice(0, 37).toString('binary'),
            hmac: tagBuffer.slice(37, 69).toString('base64'),
        };
    };
    const crypto = require('crypto');
    const DOMAIN = process.env.DOMAIN;
    const uuidDNS = [0x6b, 0xa7, 0xb8, 0x10,  0x9d, 0xad,  0x11, 0xd1,  0x80, 0xb4,  0x00, 0xc0, 0x4f, 0xd4, 0x30, 0xc8];
    const version = 0x50;
    const generateUUID = (created, uid, serial) => {
        serial = serial.replace(/:/g, '').toLowerCase();
        const domainName = `${created}.${uid}.${serial}.${DOMAIN}`;
        const bytesToHash = [...uuidDNS, ...domainName.split('').map(c => c.charCodeAt(0))];
        const hash = crypto.createHash('sha1');
        hash.update(Buffer.from(bytesToHash));
        const hashBytes = hash.digest();
        hashBytes[6] = (hashBytes[6] & 0x0f) | version;
        hashBytes[8] = (hashBytes[8] & 0x3f) | 0x80;
        return hashBytes.slice(0, 16).toString('hex');
    };
    const validateTag = async (tag, jacket) => {
        const warnings = [];
        // validation of the serial number can only take place app-side: add a reminder
        warnings.push(
            `Tag recorded serial number is ${tag.serial}.  Double check this matches the value seen in NFC Tools.`
        );
        // check for a version number we recognize
        if (tag.version !== 1) {
            warnings.push(`Unknown tag version: ${tag.version}.`);
        }
        // check the date isn't in the future or too far past
        const now = Date.now();
        if (tag.created > now) {
            warnings.push(`Tag created date in future: ${new Date(tag.created)}.`);
        }
        else if (tag.created < now - 365 * 86400 * 1000) {
            warnings.push(`Tag created date more than one year old: ${new Date(tag.created)}.`);
        }
        // uid matches juid of jacket matching UUID (though this isn't necessarily a disqualifier)
        if (tag.uid !== jacket.juid) {
            warnings.push(`Tag UID ${tag.uid} does not match jacket UID ${jacket.juid}.`);
        }
        // uuid matches what we can regenerate knowing our domain name
        if (tag.uuid !== generateUUID(tag.created, tag.uid, tag.serial)) {
            warnings.push(`Tag UUID ${tag.uuid} does not match v5 domain UUID.`);
        }
        // check the HMAC is valid
        const validSignature = await verifySignature(tag.hmacPayload, tag.hmac, tag.uid);
        if (!validSignature) {
            warnings.push(`Could not validate tag signature.  Either the UID is missing, the user's token has been revoked, or the HMAC mismatched.`);
        }
        // send back the list of warnings
        return warnings;
    };
    const getJacketByTag = async (tagBase64) => {
        const tag = tagFromBase64(tagBase64);
        const jacketSelectResult = await db.query(jacketSelectByTidQuery, [tag.uuid]);
        if (!jacketSelectResult.rows.length) { return null; }
        const jacket = jacketSelectResult.rows[0];
        // PostgreSQL is case insensitive: copy values to camel case
        jacket.jacketNumber = jacket.jacketnumber;
        jacket.specimenType = jacket.specimentype;
        // validate the tag against the jacket, and add warnings
        jacket.warnings = await validateTag(tag, jacket);
        // return the jacket
        return jacket;
    };

    const jacketInsertQuery = `insert into jackets (${jacketFieldsString}) values (${jacketValuesString}) returning jid`;
    const putJacket = async (jacket) => {
        // validate the signature
        const jhmac = jacket.jhmac;
        delete jacket.jhmac;
        const validSignature = await verifySignature(jacket, jhmac, jacket.juid);
        if (!validSignature) { return false; }
        // check for duplicate of existing jacket
        const isDuplicate = await checkHashCollision('jackets', 'jhmac', jhmac);
        if (isDuplicate) { return false; }
        // write the jacket
        const jacketInsertValues = objectValues(jacket, jacketFields);
        jacketInsertValues[jacketFields.length - 1] = jhmac;
        const jacketInsertResult = await db.query(jacketInsertQuery, jacketInsertValues);
        const jid = jacketInsertResult.rows[0].jid;
        return jid;
    };

    const photoFields = [
        'puid',
        'jid',
        'image',
        'phmac',
    ];
    const photoFieldsString = photoFields.join(', ');
    const photoValuesString = valuesString(photoFields.length);

    const photoSelectQuery = `select ${photoFieldsString} from photos where jid=$1 and pid=$2`;
    const { imageDataUriRegexp } = require('./jacket.schema.js');
    const getPhoto = async (jid, pid) => {
        const photoSelectResult = await db.query(photoSelectQuery, [jid, pid]);
        if (!photoSelectResult.rows.length) { return null; }
        const imageDataUri = photoSelectResult.rows[0].image;
        const match = imageDataUri.match(imageDataUriRegexp);
        return {
            type: match[1],
            image: Buffer.from(imageDataUri.slice(match[0].length), 'base64'),
        };
    };

    const photoIdsSelectQuery = `select pid from photos where jid=$1`;
    const getPhotoIds = async (jid) => {
        const photoIdsSelectResult = await db.query(photoIdsSelectQuery, [jid]);
        return photoIdsSelectResult.rows.map((row) => row.pid);
    };

    const photoInsertQuery = `insert into photos (${photoFieldsString}) values (${photoValuesString}) returning pid`;
    const putPhoto = async (photo) => {
        // validate the signature
        const phmac = photo.phmac;
        delete photo.phmac;
        const validSignature = await verifySignature(photo, phmac, photo.puid);
        if (!validSignature) { return false; }
        // check for duplicate of existing photo
        // NB: using the same photo is OK (such as a photo of an excavation
        //     site with multiple jackets), but using the same photo by same
        //     user of the same jacket is not OK.
        const isDuplicate = await checkHashCollision('photos', 'phmac', phmac);
        if (isDuplicate) { return false; }
        // write the photo
        const photoInsertValues = objectValues(photo, photoFields);
        photoInsertValues[photoFields.length - 1] = phmac;
        const photoInsertResult = await db.query(photoInsertQuery, photoInsertValues);
        const pid = photoInsertResult.rows[0].pid;
        return pid;
    };

    return {
        getJackets: getJackets,
        getJacket: getJacket,
        getJacketByTag: getJacketByTag,
        putJacket: putJacket,
        getPhoto: getPhoto,
        getPhotoIds: getPhotoIds,
        putPhoto: putPhoto,
    };

};
