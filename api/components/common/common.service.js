const crypto = require('crypto');
const TOKEN_KEY = process.env.TOKEN_KEY;

module.exports = function(db) {

    const keyFromUidQuery = 'select token from users where uid=$1 and revoked is null';
    const verifySignature = async (payload, hmacThem, uid) => {
        // get the user's token from the database
        const keyFromUidResult = await db.query(keyFromUidQuery, [uid]);
        if (!keyFromUidResult.rows.length) { return false; }
        const tokenBase64 = keyFromUidResult.rows[0].token;
        // decrypt the token
        const tokenDecipher = crypto.createDecipher('aes256', TOKEN_KEY);
        let token = tokenDecipher.update(tokenBase64, 'base64').toString('binary');
        token += tokenDecipher.final().toString('binary');
        // use the token as the key to compute the HMAC
        const hmac = crypto.createHmac('sha256', token);
        hmac.update(JSON.stringify(payload), 'utf8');
        hmacUs = hmac.digest('base64');
        // check we match their signature
        return (hmacUs === hmacThem);
    };

    return {
        verifySignature: verifySignature,
    };

};
