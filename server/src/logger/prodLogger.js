const { format, createLogger, transports } = require('winston')

const { timestamp, combine, errors, json } = format

const buildProdLogger = function () {
    return createLogger({
        format: combine(timestamp(), errors({ stack: true }), json()),
        defaultMeta: { service: 'user-service' },
        transports: [new transports.Console()],
    });
}

module.exports = {
    buildProdLogger
}