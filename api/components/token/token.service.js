const crypto = require('crypto');
const TOKEN_KEY = process.env.TOKEN_KEY;

module.exports = function(db) {

    const userSelectQuery = 'select uid, fullName, email, issued, token from users where email=$1 and revoked is null';
    const inspectUser = async (email) => {
        const userSelectResult = await db.query(userSelectQuery, [email]);
        if (!userSelectResult.rows.length) { throw 'No such user.'; }
        const user = userSelectResult.rows[0];
        const tokenDecipher = crypto.createDecipher('aes256', TOKEN_KEY);
        let tokenString = tokenDecipher.update(user.token, 'base64').toString('binary');
        tokenString += tokenDecipher.final().toString('binary');
        user.token = tokenString;
        return user;
    };

    const userCountQuery = 'select count(*) from users where email=$1 and revoked is null';
    const userInsertQuery = 'insert into users (fullName, email, issued, revoked, token) values ($1, $2, $3, null, $4) returning uid';
    const registerUser = async (fullName, email) => {
        // check to see if this email is already in use (with a current token)
        const userCountResult = await db.query(userCountQuery, [email]);
        const userCount = Number(userCountResult.rows[0].count);
        if (userCount) { throw 'User is already registered.'; }
        // pick a token, and create a new user entry
        const tokenBuffer = crypto.randomBytes(10);
        const tokenCipher = crypto.createCipher('aes256', TOKEN_KEY);
        let tokenCrypt = tokenCipher.update(tokenBuffer, 'buffer', 'base64');
        tokenCrypt += tokenCipher.final('base64');
        const userInsertValues = [fullName, email, Date.now(), tokenCrypt];
        const userInsertResult = await db.query(userInsertQuery, userInsertValues);
        // return the UID of the inserted row and the generated token
        const uid = userInsertResult.rows[0].uid;
        const tokenString = tokenBuffer.toString('binary');
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
