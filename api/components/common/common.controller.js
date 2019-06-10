module.exports = function(commonService) {

    const verifyEmail = async (path, query) => {
        // check we have the minimum parameters we need
        const signaturePresent = 'email' in query && 'time' in query && 'hmac' in query;
        if (!signaturePresent) { throw { status:400, message:'Bad request: missing parameters' }; }
        // avoid replay: verify time within 60 seconds of now
        const timeSynchronized = Math.abs(Date.now() - query.time) < 60000;
        if (!timeSynchronized) { throw { status:400, message:'Bad request: check your clock' }; }
        // get UID from email address
        const uid = await commonService.getUidFromEmail(query.email);
        if (uid === false) { throw { status: 404, message:'User not found' }; }
        // aggregate all the variable data used to sign
        const payload = { email:query.email, path:path, time:Number(query.time) };
        // ask the service to verify the signature using the user's key
        const validHmac = await commonService.verifySignature(payload, query.hmac, uid);
        if (!validHmac) { throw { status:401, message:'Unauthorized' }; }
        // everything is OK: mutate query with UID, and return nothing
        query.uid = uid;
        return;
    };

    const verifySignature = async (path, query, body) => {
        // check we have the minimum parameters we need
        const signaturePresent = 'uid' in query && 'time' in query && 'hmac' in query;
        if (!signaturePresent) { throw { status:400, message:'Bad request: missing parameters' }; }
        // avoid replay: verify time within 60 seconds of now
        const timeSynchronized = Math.abs(Date.now() - query.time) < 60000;
        if (!timeSynchronized) { throw { status:400, message:'Bad request: check your clock' }; }
        // aggregate all the variable data used to sign
        const payload = { path:path, ...query, ...body };
        payload.uid = Number(payload.uid);
        payload.time = Number(payload.time);
        delete payload.hmac;
        // ask the service to verify the signature using the user's key
        const validHmac = await commonService.verifySignature(payload, query.hmac, payload.uid);
        if (!validHmac) { throw { status:401, message:'Unauthorized' }; }
        // everything is OK: return nothingburger
        return;
    };

    return {
        verifyEmail: verifyEmail,
        verifySignature: verifySignature,
    };

};
