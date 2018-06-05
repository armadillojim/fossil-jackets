const express = require('express');

module.exports = function TokenRouter(tokenController) {

    const router = express.Router();

    router.get('/verify', (req, res, next) => {
        // common middleware checks for a valid signature on all requests so we
        // only need to send an OK if the request has already been forwarded here
        res.status(200).send('OK');
    });

    return router;

};
