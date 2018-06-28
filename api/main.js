// Create an Express app
const express = require('express');
const app = express();
const router = express.Router();

// Create a logging facility
const logger = require('./lib/initLogger.js');

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
const initDb = require('./lib/initDb.js')(logger);

// Start the listener and the database connection
Promise.all([
    listen,
    initDb
]).then(([_, db]) => {

    // Strip the /api prefix and pass all calls to the router
    app.use('/api', router);

    // Install all our middleware
    const commonComponent = require('./components/common')(logger, db);
    router.use(commonComponent);
    const jacketComponent = require('./components/jacket')(db);
    router.use('/jacket', jacketComponent);
    const tokenComponent = require('./components/token')(db);
    router.use('/token', tokenComponent);

    // Install two default handlers for missing resources and for errors
    router.use('*', (req, res, next) => { res.sendStatus(404); });
    router.use((err, req, res, next) => {
        const replacer = err instanceof Error ? Object.getOwnPropertyNames(err) : null;
        logger.error('api-server got an error: ' + JSON.stringify(err, replacer, 4));
        const status = err.status || 500;
        const message = err.message || 'Unknown error';
        res.status(status).send(message);
    });

}).catch((err) => {
    logger.error(err);
});
