const express = require('express');

module.exports = function TokenRouter(tokenController) {

    const router = express.Router();

    router.get('/verify', (req, res, next) => {
        // common middleware checks for a valid signature on all requests
        // we need to return the user's UID from their email address
        res.status(200).send({ uid: req.query.uid });
    });

    return router;

};
