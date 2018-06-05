// Sort the keys on the array objects to get a stable JSON.  We rely on ES6
// behavior: keys are iterated over in the order they were added.  Also consider
// libraries such as:
// * https://www.npmjs.com/package/json-stable-stringify
// * https://www.npmjs.com/package/jsonlint
// * https://stackoverflow.com/a/31102605
function sortObject(unordered) {
    const ordered = {};
    Object.keys(unordered).sort().forEach(function(key) {
        ordered[key] = unordered[key];
    });
    return ordered;
}

module.exports = function(commonService) {

    const verifySignature = async (path, query, body) => {
        // check we have the minimum parameters we need
        const signaturePresent = 'uid' in query && 'time' in query && 'hmac' in query;
        if (!signaturePresent) { throw { status:400, message:'Bad request: missing parameters' }; }
        // avoid replay: verify time within 60 seconds of now
        const timeSynchronized = Math.abs(Date.now() - query.time) < 60000;
        if (!timeSynchronized) { throw { status:400, message:'Bad request: check your clock' }; }
        // aggregate in regular order all the variable data used to sign
        const payload = sortObject({ path:path, ...query, ...body });
        delete payload.hmac;
        // ask the service to verify the signature using the user's key
        const validHmac = await commonService.verifySignature(payload, query.hmac, query.uid);
        if (!validHmac) { throw { status:401, message:'Unauthorized' }; }
        // everything is OK: return nothingburger
        return;
    };

    return {
        verifySignature: verifySignature,
    };

};
