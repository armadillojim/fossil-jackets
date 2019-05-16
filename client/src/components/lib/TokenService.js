import sjcl from './sjcl';

// Generate a SHA256 from the user's email and password
const tokenFromPassword = (email, password) => {
  const sha = new sjcl.hash.sha256();
  sha.update(sjcl.codec.utf8String.toBits(email));
  sha.update(sjcl.codec.utf8String.toBits(password));
  return sha.finalize();
};

// Sort the keys on the array objects to get a stable JSON.  We rely on ES6
// behavior: keys are iterated over in the order they were added.  Also consider
// libraries such as:
// * https://www.npmjs.com/package/json-stable-stringify
// * https://www.npmjs.com/package/jsonlint
// * https://stackoverflow.com/a/31102605
const sortObject = (unordered) => {
    const ordered = {};
    Object.keys(unordered).sort().forEach((key) => {
        ordered[key] = unordered[key];
    });
    return ordered;
};

const generateSignature = (payload, token) => {
    // sort the payload into a standard order, and JSONify it
    const payloadJSON = JSON.stringify(sortObject(payload));
    // use the token as the key to compute the HMAC
    const hmacSigner = new sjcl.misc.hmac(token, sjcl.hash.sha256);
    const hmacBits = hmacSigner.mac(payloadJSON);
    return sjcl.codec.base64.fromBits(hmacBits);
};

export { tokenFromPassword, generateSignature };
