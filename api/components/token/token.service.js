const crypto = require('crypto');
const TOKEN_KEY = process.env.TOKEN_KEY;

module.exports = function(db) {

    const saltLength = 8;

    const userSelectQuery = 'select uid, fullName, email, issued, token from users where email=$1 and revoked is null';
    const inspectUser = async (email) => {
        const userSelectResult = await db.query(userSelectQuery, [email]);
        if (!userSelectResult.rows.length) { throw 'No such user.'; }
        const user = userSelectResult.rows[0];
        const tokenDecipher = crypto.createDecipher('aes256', TOKEN_KEY);
        let tokenString = tokenDecipher.update(user.token, 'base64').toString('hex');
        tokenString += tokenDecipher.final().toString('hex');
        user.token = tokenString.slice(2*saltLength);
        return user;
    };

    const userCountQuery = 'select count(*) from users where email=$1 and revoked is null';
    const userInsertQuery = 'insert into users (fullName, email, issued, revoked, token) values ($1, $2, $3, null, $4) returning uid';
    const registerUser = async (fullName, email, password) => {
        // check to see if this email is already in use (with a current token)
        const userCountResult = await db.query(userCountQuery, [email]);
        const userCount = Number(userCountResult.rows[0].count);
        if (userCount) { throw 'User is already registered.'; }
        // generate token from hashed email and password, and create a new user entry
        const hash = crypto.createHash('sha256');
        hash.update(email);
        hash.update(password);
        const tokenBuffer = hash.digest();
        const saltBuffer = crypto.randomBytes(saltLength);
        const tokenCipher = crypto.createCipher('aes256', TOKEN_KEY);
        let tokenCrypt = tokenCipher.update(saltBuffer, 'buffer', 'base64');
        tokenCrypt += tokenCipher.update(tokenBuffer, 'buffer', 'base64');
        tokenCrypt += tokenCipher.final('base64');
        const userInsertValues = [fullName, email, Date.now(), tokenCrypt];
        const userInsertResult = await db.query(userInsertQuery, userInsertValues);
        // return the UID of the inserted row and the generated token
        const uid = userInsertResult.rows[0].uid;
        const tokenString = tokenBuffer.toString('hex');
        return { uid: uid, token: tokenString };
    };

    const userRevokeQuery = 'update users set revoked=$1 where email=$2 and revoked is null';
    const revokeUser = async (email) => {
        // revoke tokens (if any), ignore the result, and simply return
        await db.query(userRevokeQuery, [Date.now(), email]);
        return;
    };

    return {
        inspectUser: inspectUser,
        registerUser: registerUser,
        revokeUser: revokeUser,
    };

};
