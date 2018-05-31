module.exports = (db) => {

    const TokenService = require('./token.service.js');
    const TokenController = require('./token.controller.js');
    const TokenRouter = require('./token.router.js');

    const tokenService = new TokenService(db);
    const tokenController = new TokenController(tokenService);
    const tokenRouter = new TokenRouter(tokenController);

    return tokenRouter;

};
