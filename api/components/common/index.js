/**
 * Middleware common to all requests
 */
module.exports = (logger) => {
    const CommonRouter = require('./common.router.js');
    const commonRouter = new CommonRouter(logger);
    return commonRouter;
};
