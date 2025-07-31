const { httpCreateProductService, httpGetProductsService, httpGetProdcutDescService, httpGetProductByCategoryService,
    httpDeleteItemFromCartService, httpAddItemToCartService, httpDeleteWishListService, httpPutWishListService, 
    httpGetProductFromRedisController} = require("../services/product.service")



const createProductController = (req, res, next) => httpCreateProductService(req, res, next)

const getProductController = (req, res, next) => httpGetProductsService(req, res, next)

const getProductDescController = (req, res, next) => httpGetProdcutDescService(req, res, next)

const getProductByCategoryController = (req, res, next) => httpGetProductByCategoryService(req, res, next)

// -----

const putWishListController = (req, res, next) => httpPutWishListService(req, res, next)

const deleteWishListController = (req, res, next) => httpDeleteWishListService(req, res, next)

const addItemToCartController = (req, res, next) => httpAddItemToCartService(req, res, next)

const deleteItemFromCartController = (req, res, next) => httpDeleteItemFromCartService(req, res, next)

const getProductFromRedisController = (req, res, next) => httpGetProductFromRedisController(req, res, next)

module.exports = {
    createProductController,
    getProductController,
    getProductDescController,
    getProductByCategoryController,
    putWishListController,
    deleteWishListController,
    addItemToCartController,
    deleteItemFromCartController,
    getProductFromRedisController,

}