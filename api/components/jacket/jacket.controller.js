const Ajv = require('ajv');
const { jacketSchema, base64Format, recentFormat } = require('./jacket.schema.js');

const ajv = new Ajv({ formats: {
    base64: base64Format,
    recent: recentFormat,
}});
const validate = ajv.compile(jacketSchema);

module.exports = function(jacketService) {

    const putJacket = async (jacket) => {
        const validJacket = validate(jacket);
        if (!validJacket) { throw { status: 400, message: 'Bad request' }; }
        const jid = await jacketService.putJacket(jacket);
        return jid;
    };

    return {
        putJacket: putJacket,
    };

};
