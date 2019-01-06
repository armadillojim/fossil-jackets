const express = require('express');

module.exports = function JacketRouter(jacketController) {

    const router = express.Router();

    router.get('/', (req, res, next) => {
        jacketController.getJackets()
            .then((jackets) => { res.status(200).send(jackets); })
            .catch(next);
    });

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
        jacketController.getPhoto(req.params.jid, req.params.pid)
            .then((photo) => { res.type(photo.type); res.status(200).send(photo.image); })
            .catch(next);
    });

    router.get('/:id/photo', (req, res, next) => {
        jacketController.getPhotoIds(req.params.id)
            .then((pids) => { res.status(200).send(pids); })
            .catch(next);
    });

    router.put('/:id/photo', (req, res, next) => {
        jacketController.putPhoto(req.params.id, req.body)
            .then((pid) => { res.status(200).send(`${pid}`); })
            .catch(next);
    });

    return router;

};
