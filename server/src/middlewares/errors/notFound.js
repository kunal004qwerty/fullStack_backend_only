
const createHttpError = require('http-errors')

const notFoundMiddleware = async function (req, res, next) {
    next(createHttpError(404, `Route - ${req.originalUrl} Not Found`))
}

module.exports = {
    notFoundMiddleware,
}