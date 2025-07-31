const customResponse = function ({ data, success, error, message, status }) {
    return {
        success,
        error,
        message,
        status,
        data,
    }
}

module.exports = {
    customResponse,
}