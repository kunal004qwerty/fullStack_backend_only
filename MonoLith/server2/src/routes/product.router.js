const express = require('express')
const { isAuth } = require('../middlewares/auth/isAuth')
const { createProductController, getProductController, addItemToCartController, deleteItemFromCartController,
    deleteWishListController, getProductByCategoryController, getProductDescController, putWishListController, 
    getProductFromRedisController} = require('../controllers/product.controller')
const { httpSeedProductsService } = require('../services/product.service')

const productRouter = express.Router()

//  /products
productRouter.post('/create', createProductController)
productRouter.get('/', getProductController)


// learnin redis
productRouter.get('/redisexamin', getProductFromRedisController)

productRouter.get('/:id', getProductDescController)
productRouter.get('/category/:type', getProductByCategoryController)

productRouter.put('/wishlist', isAuth, putWishListController)
productRouter.delete('/wishlist/:id', isAuth, deleteWishListController)

productRouter.put('/cart', isAuth, addItemToCartController)
productRouter.delete('/cart/:id', isAuth, deleteItemFromCartController)

// create a bulk order 
productRouter.post('/bulkproducts', httpSeedProductsService)


module.exports = {
    productRouter
}