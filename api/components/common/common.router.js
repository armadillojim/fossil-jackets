const express = require('express');
const bodyParser = require('body-parser');

module.exports = function CommonRouter(logger) {

    const router = express.Router();

    // Parse HTTP request bodies as JSON
    router.use(bodyParser.json({ strict: false }));

    // Log all requests, and forward them to the next middleware function
    router.use((req, res, next) => {
        logger.info(`${req.method} ${req.url}`);
        next();
    });

    return router;

};
