const { logger } = require("../../logger");

process.on('unhandledRejection', (reason) => {
    console.log(`Unhandled Rejection: ${reason.message || reason}`.red);

    throw new Error(reason.message || reason)
})

process.on('uncaughtException', (error) => {
    console.log(`Uncatch Exception: ${error.message}`.inverse);

    logger.error({
        message: `Uncatch Exception: ${error.message}`
    })

    // process.exit(1)

})