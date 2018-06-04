// Register a new user from the command line.

const askQuestions = require('./lib/readlineAskQuestions.js');

const initDb = require('./initDb.js')(console);
initDb.then((db) => {
    const { registerUser } = require('./components/token/token.service.js')(db);
    askQuestions(['Full Name', 'Email'], async (answers) => {
        try {
            const { uid, token } = await registerUser(...answers);
            const stringToDictionary = require('./tokenDictionary.js');
            console.log(`UID: ${uid}`);
            console.log(`token: ${stringToDictionary(token)}`);
            const logger = require('./initLogger.js');
            logger.info(`registered user ${uid} ${answers}`);
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
