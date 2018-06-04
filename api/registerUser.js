// Register a new user from the command line.

// NB: this appears to hang.  There was a bug in readline on close events in
// node 8.1.0, but supposedly that's fixed.  Also, for now initLogger.js just
// outputs to stdout, but this will go to syslog eventually.

const readline = require('readline');
const readlineStd = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
});
const askQuestions = (questions, finish, answers) => {
    answers = answers || [];
    if (questions.length) {
        readlineStd.question(questions.shift() + '? ', (answer) => {
            answers.push(answer);
            askQuestions(questions, finish, answers);
        });
    } else {
        readlineStd.close();
        finish(answers);
    }
};

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
        }
    });
}).catch((err) => {
    console.error(err);
});
