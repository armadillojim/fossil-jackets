const express = require('express');

module.exports = function JacketRouter(jacketController) {

    const router = express.Router();

    router.put('/', (req, res, next) => {
        jacketController.putJacket(req.body)
            .then(() => { res.status(200).send('"OK"'); })
            .catch(next);
    });

    return router;

};
