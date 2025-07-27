require('dotenv').config()

const { buildProdLogger } = require("./prodLogger")
const { buildDevLogger } = require('./devLoggers')

let logger
if (process.env.NODE_ENV === 'development') {
    logger = buildDevLogger()
} else {
    logger = buildProdLogger()
}

module.exports = {
    logger,
}