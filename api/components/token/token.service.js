const crypto = require('crypto');

module.exports = function(db) {

    const userCountQuery = 'select count(*) from users where email=$1 and revoked is null';
    const userInsertQuery = 'insert into users (fullName, email, issued, revoked, token) values ($1, $2, $3, null, $4) returning uid';
    const registerUser = async (fullName, email) => {
        // check to see if this email is already in use (with a current token)
        const userCountResult = await db.query(userCountQuery, [email]);
        const userCount = Number(userCountResult.rows[0].count);
        if (userCount) { throw 'User is already registered.'; }
        // pick a token, and create a new user entry
        const tokenBuffer = crypto.randomBytes(10);
        const userInsertValues = [fullName, email, Date.now(), tokenBuffer.toString('base64')];
        const userInsertResult = await db.query(userInsertQuery, userInsertValues);
        const uid = userInsertResult.rows[0].uid;
        // return the UID of the inserted row and the generated token
        return { uid: uid, token: tokenBuffer.toString('binary') };
    };

    return {
        registerUser: registerUser,
    };

};
