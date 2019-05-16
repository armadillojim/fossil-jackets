// Register a new user from the command line.

const askQuestions = require('./lib/readlineAskQuestions.js');

const initDb = require('./lib/initDb.js')(console);
initDb.then((db) => {
    const { registerUser } = require('./components/token/token.service.js')(db);
    askQuestions(['Full Name', 'Email', 'Password'], async (answers) => {
        try {
            const { uid, token } = await registerUser(...answers);
            console.log(`UID: ${uid}`);
            console.log(`token: ${token}`);
            const logger = require('./lib/initLogger.js');
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
