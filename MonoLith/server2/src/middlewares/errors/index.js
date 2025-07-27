const { notFoundMiddleware } = require('./notFound');
const { errorHandlerMiddleware } = require('./errorhandler');

module.exports = {
    notFoundMiddleware,
    errorHandlerMiddleware,
};