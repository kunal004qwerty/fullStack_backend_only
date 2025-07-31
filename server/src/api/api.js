const express = require('express')
const { healthCheckRouter } = require('../routes/healthCheckroute')
const { customerRouter } = require('../routes/customer.router')
const { productRouter } = require('../routes/product.router')
const { shoppingRouter } = require('../routes/shopping.router')

const api = express.Router()

api.use('/healthChecker', healthCheckRouter)
api.use('/customer', customerRouter)
api.use('/products', productRouter)
api.use('/shopping', shoppingRouter)

module.exports = api