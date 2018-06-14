module.exports = function(db) {

    const CommonService = require('../common/common.service.js');
    const { verifySignature } = new CommonService(db);

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
    const jacketValuesString = Array(jacketFields.length).fill(null).map((_, i) => `$${i + 1}`).join(', ');
    const jacketValues = (jacket) => {
        const l = jacketFields.length;
        const values = Array(l);
        for (var i = 0; i < l; i++) {
            values[i] = jacket[jacketFields[i]] || null;
        }
        return values;
    };

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
        const jacketInsertValues = jacketValues(jacket);
        jacketInsertValues[jacketFields.length - 1] = jhmac;
        const jacketInsertResult = await db.query(jacketInsertQuery, jacketInsertValues);
        const jid = jacketInsertResult.rows[0].jid;
        return jid;
    };

    return {
        getJacket: getJacket,
        putJacket: putJacket,
    };

};
