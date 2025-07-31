const express = require('express')
const { customResponse } = require('../utils')

const healthCheckRouter = express.Router()

healthCheckRouter.get('/', (req, res, next) => {
    const message = 'Welcome to Rest API - 👋🌎🌍🌏 - health check confirm';


    res.send(customResponse({
        data: null,
        success: true,
        error: false,
        message,
        status: 200
    }))
})

module.exports = {
    healthCheckRouter,
}