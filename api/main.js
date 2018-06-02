// Create an Express app
const express = require('express');
const app = express();

// Create a logging facility
const winston = require('winston');
const simpleFormat = winston.format.printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});
// TODO: use syslog to log events to SYSLOG_URL
// * https://github.com/winstonjs/winston-syslog
// * https://github.com/lazywithclass/winston-cloudwatch
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        simpleFormat
    ),
    transports: [new winston.transports.Console()]
});

// Create a listener promise for the API web server
const os = require('os');
const port = process.env.API_PORT || 3000;
const listen = new Promise(
    (resolve, reject) => {
        app.listen(port, () => {
            logger.info(`api-server: listening on ${os.hostname()}:${port}`);
            resolve();
        });
    }
);

// Create a database promise for a connection
const initDb = require('./initDb.js')(logger);

// Start the listener and the database connection
Promise.all([
    listen,
    initDb
]).then(([_, db]) => {

    // Install all our middleware
    const commonComponent = require('./components/common')(logger);
    app.use(commonComponent);
    const jacketComponent = require('./components/jacket')(db);
    app.use('/jacket', jacketComponent);
    const tokenComponent = require('./components/token')(db);
    app.use('/token', tokenComponent);

    // Install two default handlers for missing resources and for errors
    app.use('*', (req, res, next) => { res.sendStatus(404); });
    app.use((err, req, res, next) => {
        const replacer = err instanceof Error ? Object.getOwnPropertyNames(err) : null;
        logger.error('api-server got an error: ' + JSON.stringify(err, replacer, 4));
        const status = err.status || 500;
        const message = err.message || 'Unknown error';
        res.status(status).send(message);
    });

}).catch((err) => {
    logger.error(err);
});
