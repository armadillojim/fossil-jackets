// Inspect an existing user from the command line.

const askQuestions = require('./lib/readlineAskQuestions.js');

const initDb = require('./initDb.js')(console);
initDb.then((db) => {
    const { inspectUser } = require('./components/token/token.service.js')(db);
    askQuestions(['Email'], async (answers) => {
        try {
            const user = await inspectUser(...answers);
            const stringToDictionary = require('./tokenDictionary.js');
            console.log(`UID: ${user.uid}`);
            console.log(`Full name: ${user.fullname}`); // NB: capitalization b/c of postgres column name insensitivity
            console.log(`Email: ${user.email}`);
            console.log(`Issued: ${new Date(Number(user.issued))}`);
            console.log(`token: ${stringToDictionary(user.token)}`);
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
