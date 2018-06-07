const express = require('express');

module.exports = function JacketRouter(jacketController) {

    const router = express.Router();

    router.get('/:id', (req, res, next) => {
        jacketController.getJacket(req.params.id)
            .then((jacket) => { res.status(200).send(jacket); })
            .catch(next);
    });

    router.put('/', (req, res, next) => {
        jacketController.putJacket(req.body)
            .then(() => { res.status(200).send('"OK"'); })
            .catch(next);
    });

    return router;

};
