// Prompt questions from the command line.

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

module.exports = askQuestions;
