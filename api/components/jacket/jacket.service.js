module.exports = function(db) {

    const CommonService = require('../common/common.service.js');
    const { verifySignature } = new CommonService(db);

    const jacketFields = [
        'version',
        'uid',
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
        'tidA',
        'tidB',
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

    const jacketInsertQuery = `insert into jackets (${jacketFieldsString}) values (${jacketValuesString}) returning jid`;
    const putJacket = async (jacket) => {
        // validate the signature
        const jhmac = jacket.jhmac;
        delete jacket.jhmac;
        const validSignature = await verifySignature(jacket, jhmac, jacket.uid);
        if (!validSignature) { throw { status:400, message: 'Bad jacket signature' }; }
        // write the jacket
        const jacketInsertValues = jacketValues(jacket);
        jacketInsertValues[jacketFields.length - 1] = jhmac;
        const jacketInsertResult = await db.query(jacketInsertQuery, jacketInsertValues);
        const jid = jacketInsertResult.rows[0].jid;
        return jid;
    };

    return {
        putJacket: putJacket,
    };

};
