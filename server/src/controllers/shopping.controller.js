const { httpPlaceOrderService, httpOrderDetailService, httpCartDetailService } = require("../services/shopping.service")



const placeOrderController = (req, res, next) => httpPlaceOrderService(req, res, next)

const orderDetailController = (req, res, next) => httpOrderDetailService(req, res, next)

const cartDetailController = (req, res, next) => httpCartDetailService(req, res, next)

module.exports = {
    placeOrderController,
    orderDetailController,
    cartDetailController,
}