/**
 * Middleware common to all requests
 */
module.exports = (logger, db) => {

    const CommonService = require('./common.service.js');
    const CommonController = require('./common.controller.js');
    const CommonRouter = require('./common.router.js');

    const commonService = new CommonService(db);
    const commonController = new CommonController(commonService);
    const commonRouter = new CommonRouter(commonController, logger);

    return commonRouter;

};
