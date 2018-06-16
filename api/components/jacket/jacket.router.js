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
            .then((jid) => { res.status(200).send(`${jid}`); })
            .catch(next);
    });

    router.get('/:jid/photo/:pid', (req, res, next) => {
        // We should call res.type('png') based the magic bytes in photo,
        // but that requires another heavy library.
        jacketController.getPhoto(req.params.jid, req.params.pid)
            .then((photo) => { res.status(200).send(photo); })
            .catch(next);
    });

    router.put('/:id/photo', (req, res, next) => {
        jacketController.putPhoto(req.params.id, req.body)
            .then((pid) => { res.status(200).send(`${pid}`); })
            .catch(next);
    });

    return router;

};
