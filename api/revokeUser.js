// Revoke tokens an existing user from the command line.

const askQuestions = require('./lib/readlineAskQuestions.js');

const initDb = require('./lib/initDb.js')(console);
initDb.then((db) => {
    const { revokeUser } = require('./components/token/token.service.js')(db);
    askQuestions(['Email'], async (answers) => {
        try {
            const [ email ] = answers;
            const user = await revokeUser(email);
            console.log(`Revoked all tokens for ${email}`);
        } catch (err) {
            console.error(err);
            return;
        } finally {
            await db.end();
        }
    });
}).catch((err) => {
    console.error(err);
});
