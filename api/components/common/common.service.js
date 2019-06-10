// Sort the keys on the array objects to get a stable JSON.  We rely on ES6
// behavior: keys are iterated over in the order they were added.  Also consider
// libraries such as:
// * https://www.npmjs.com/package/json-stable-stringify
// * https://www.npmjs.com/package/jsonlint
// * https://stackoverflow.com/a/31102605
function sortObject(unordered) {
    const ordered = {};
    Object.keys(unordered).sort().forEach((key) => {
        ordered[key] = unordered[key];
    });
    return ordered;
}

const crypto = require('crypto');
const TOKEN_KEY = process.env.TOKEN_KEY;

module.exports = function(db) {

    const saltLength = 8;

    const keyFromUidQuery = 'select token from users where uid=$1 and revoked is null';
    const generateSignature = async (payload, uid) => {
        const payloadType = typeof(payload);
        if (payloadType === 'string') {
            // do nothing
        }
        else if (payloadType === 'object') {
            // sort the payload into a standard order, and JSONify it
            payload = JSON.stringify(sortObject(payload));
        }
        else {
            throw { message: `unknown payload type: ${payloadType}` };
        }
        // get the user's token from the database
        const keyFromUidResult = await db.query(keyFromUidQuery, [uid]);
        if (!keyFromUidResult.rows.length) { return false; }
        const tokenBase64 = keyFromUidResult.rows[0].token;
        // decrypt the token
        const tokenDecipher = crypto.createDecipher('aes256', TOKEN_KEY);
        const token = Buffer.concat([
            tokenDecipher.update(tokenBase64, 'base64'),
            tokenDecipher.final(),
        ]).slice(saltLength);
        // use the token as the key to compute the HMAC
        const hmacSigner = crypto.createHmac('sha256', token);
        hmacSigner.update(payload, payloadType === 'object' ? 'utf8' : 'binary');
        const hmac = hmacSigner.digest('base64');
        return hmac;
    };

    const uidFromEmailQuery = 'select uid from users where email=$1 and revoked is null';
    const getUidFromEmail = async (email) => {
        // delay lookup to frustrate scrapers
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await sleep(1000);
        // check for a valid user with that email address
        const uidFromEmailResult = await db.query(uidFromEmailQuery, [email]);
        if (!uidFromEmailResult.rows.length) { return false; }
        const uid = uidFromEmailResult.rows[0].uid;
        return uid;
    };

    const verifySignature = async (payload, hmacThem, uid) => {
        const hmacUs = await generateSignature(payload, uid);
        return (hmacUs === hmacThem);
    };

    return {
        generateSignature: generateSignature,
        getUidFromEmail: getUidFromEmail,
        verifySignature: verifySignature,
    };

};
