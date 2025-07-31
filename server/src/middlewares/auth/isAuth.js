const { validateSignature } = require("./authUtils")
const createHttpError = require('http-errors')

const isAuth = async function (req, res, next) {
    const isAuthorized = await validateSignature(req)
    if (isAuthorized) {
        return next()
    } else {
        // return res.status(403).json({ message: 'Not Authorized' })
        return next(createHttpError(422, `Not Authorized`))
    }
}

module.exports = {
    isAuth
}