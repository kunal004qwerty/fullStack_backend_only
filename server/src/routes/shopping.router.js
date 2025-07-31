const express = require('express')
const { isAuth } = require('../middlewares/auth/isAuth')
const { placeOrderController, orderDetailController, cartDetailController } = require('../controllers/shopping.controller')

const shoppingRouter = express.Router()

// /shopping

shoppingRouter.post('/order', isAuth, placeOrderController)
shoppingRouter.get('/orders', isAuth, orderDetailController)
shoppingRouter.get('/cart', isAuth, cartDetailController)

module.exports = {
    shoppingRouter
}