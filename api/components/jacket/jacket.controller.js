const Ajv = require('ajv');
const { jacketSchema, photoSchema, base64Format, imageDataUriFormat, recentFormat } = require('./jacket.schema.js');

const ajv = new Ajv({ formats: {
    base64: base64Format,
    imageDataUri: imageDataUriFormat,
    recent: recentFormat,
}});
const validateJacket = ajv.compile(jacketSchema);
const validatePhoto = ajv.compile(photoSchema);

module.exports = function(jacketService) {

    const getJackets = async () => {
        const jackets = await jacketService.getJackets();
        return jackets;
    };

    const getJacket = async (jid) => {
        // regex patterns for tag IDs; note case sensitivity
        const HexTIDpattern = /^[0-9A-F]{14}$/;
        const UUIDpattern = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/;
        // if we got a numeric value, assume it is a database row ID
        if (Number(jid).toString() === jid) {
            const jacket = await jacketService.getJacket(jid);
            if (jacket === null) { throw { status: 404, message: 'No such jacket' }; }
            return jacket;
        }
        // if we got a UUID or 14-digit hexadecimal number, assume it is a tag payload
        else if (HexTIDpattern.test(jid) || UUIDpattern.test(jid)) {
            const jacket = await jacketService.getJacketByTagID(jid);
            if (jacket === null) { throw { status: 404, message: 'No such jacket' }; }
            return jacket;
        }
        // we don't recognize the format of the passed parameter
        throw { status:400, message: 'Bad parameter' };
    };

    const putJacket = async (jacket) => {
        const validJacket = validateJacket(jacket);
        if (!validJacket) { throw { status: 400, message: 'Bad request' }; }
        const jid = await jacketService.putJacket(jacket);
        if (jid === false) { throw { status:400, message: 'Bad jacket signature' }; }
        return jid;
    };

    const getPhoto = async (jid, pid) => {
        const photo = await jacketService.getPhoto(jid, pid);
        if (photo === null) { throw { status: 404, message: 'No such photo' }; }
        return photo;
    };

    const getPhotoIds = async (jid) => {
        const pids = await jacketService.getPhotoIds(jid);
        return pids;
    };

    const putPhoto = async (jid, photo) => {
        const validPhoto = validatePhoto(photo) && Number(jid) === photo.jid;
        if (!validPhoto) { throw { status: 400, message: 'Bad request' }; }
        const pid = await jacketService.putPhoto(photo);
        if (pid === false) { throw { status:400, message: 'Bad photo signature' }; }
        return pid;
    };

    return {
        getJackets: getJackets,
        getJacket: getJacket,
        putJacket: putJacket,
        putPhoto: putPhoto,
        getPhoto: getPhoto,
        getPhotoIds: getPhotoIds,
    };

};
