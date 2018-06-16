module.exports = function(db) {

    const CommonService = require('../common/common.service.js');
    const { verifySignature } = new CommonService(db);

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

    const jacketSelectQuery = `select ${jacketFieldsString} from jackets where jid=$1 and seeAlso is null`;
    const getJacket = async (jid) => {
        const jacketSelectResult = await db.query(jacketSelectQuery, [jid]);
        if (!jacketSelectResult.rows.length) { return null; }
        return jacketSelectResult.rows[0];
    };

    const jacketInsertQuery = `insert into jackets (${jacketFieldsString}) values (${jacketValuesString}) returning jid`;
    const putJacket = async (jacket) => {
        // validate the signature
        const jhmac = jacket.jhmac;
        delete jacket.jhmac;
        const validSignature = await verifySignature(jacket, jhmac, jacket.juid);
        if (!validSignature) { return false; }
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
    const getPhoto = async (jid, pid) => {
        const photoSelectResult = await db.query(photoSelectQuery, [jid, pid]);
        if (!photoSelectResult.rows.length) { return null; }
        return Buffer.from(photoSelectResult.rows[0].image, 'base64');
    };

    const photoInsertQuery = `insert into photos (${photoFieldsString}) values (${photoValuesString}) returning pid`;
    const putPhoto = async (photo) => {
        // validate the signature
        const phmac = photo.phmac;
        delete photo.phmac;
        const validSignature = await verifySignature(photo, phmac, photo.puid);
        if (!validSignature) { return false; }
        // write the photo
        const photoInsertValues = objectValues(photo, photoFields);
        photoInsertValues[photoFields.length - 1] = phmac;
        const photoInsertResult = await db.query(photoInsertQuery, photoInsertValues);
        const pid = photoInsertResult.rows[0].pid;
        return pid;
    };

    return {
        getJacket: getJacket,
        putJacket: putJacket,
        getPhoto: getPhoto,
        putPhoto: putPhoto,
    };

};
