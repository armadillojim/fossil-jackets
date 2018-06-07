const Ajv = require('ajv');
const { jacketSchema, base64Format, recentFormat } = require('./jacket.schema.js');

const ajv = new Ajv({ formats: {
    base64: base64Format,
    recent: recentFormat,
}});
const validate = ajv.compile(jacketSchema);

module.exports = function(jacketService) {

    const getJacket = async (jid) => {
        const jacket = await jacketService.getJacket(jid);
        if (jacket === null) { throw { status: 404, message: 'No such jacket' }; }
        return jacket;
    };

    const putJacket = async (jacket) => {
        const validJacket = validate(jacket);
        if (!validJacket) { throw { status: 400, message: 'Bad request' }; }
        const jid = await jacketService.putJacket(jacket);
        if (jid === false) { throw { status:400, message: 'Bad jacket signature' }; }
        return jid;
    };

    return {
        getJacket: getJacket,
        putJacket: putJacket,
    };

};
