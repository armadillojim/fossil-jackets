module.exports = (db) => {

    const JacketService = require('./jacket.service.js');
    const JacketController = require('./jacket.controller.js');
    const JacketRouter = require('./jacket.router.js');

    const jacketService = new JacketService(db);
    const jacketController = new JacketController(jacketService);
    const jacketRouter = new JacketRouter(jacketController);

    return jacketRouter;

};
