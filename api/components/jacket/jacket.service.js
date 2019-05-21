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

    const jacketsSelectQuery = `select jid, ${jacketFieldsString}, fullname from jackets join users on users.uid=jackets.juid where seeAlso is null`;
    const getJackets = async () => {
        const jacketsSelectResult = await db.query(jacketsSelectQuery, []);
        return jacketsSelectResult.rows;
    };

    const jacketSelectQuery = `select ${jacketFieldsString}, fullname, email from jackets join users on users.uid=jackets.juid where jid=$1 and seeAlso is null`;
    const getJacket = async (jid) => {
        const jacketSelectResult = await db.query(jacketSelectQuery, [jid]);
        if (!jacketSelectResult.rows.length) { return null; }
        return jacketSelectResult.rows[0];
    };

    const jacketSelectByTidQuery = `select jid, ${jacketFieldsString} from jackets where tid=$1 and seeAlso is null`;
    const getJacketByTagID = async (tid) => {
        const jacketSelectResult = await db.query(jacketSelectByTidQuery, [tid]);
        if (!jacketSelectResult.rows.length) { return null; }
        const jacket = jacketSelectResult.rows[0];
        // PostgreSQL is case insensitive: copy values to camel case
        jacket.jacketNumber = jacket.jacketnumber;
        jacket.specimenType = jacket.specimentype;
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
        getJacketByTagID: getJacketByTagID,
        putJacket: putJacket,
        getPhoto: getPhoto,
        getPhotoIds: getPhotoIds,
        putPhoto: putPhoto,
    };

};
