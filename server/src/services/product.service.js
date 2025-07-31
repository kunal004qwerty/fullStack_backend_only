const createHttpError = require('http-errors');
const { createProduct, allProduct, productById, productByCategory } = require('../repository/product-repository');
const { customResponse } = require('../utils');
const { addWishListItem, addCartItem } = require('../repository/customer-repository');
const { PRODUCT } = require('../models');
const { getDataFromRedis, setDataToRedis } = require('../config/redisHelper');

const httpCreateProductService = async function (req, res, next) {
    try {

        const product = await createProduct(req.body)

        const data = {
            product: {
                id: product.id,
                name: product.name,
                desc: product.desc,
                banner: product.banner,
                type: product.type,
                unit: product.unit,
                price: product.price,
                available: product.available,
                supplier: product.supplier,
            },
            user: {
                name: "Admin",
            },
            request: {
                type: 'Get',
                description: 'Get all products',
                url: `${process.env.API_URL}/api/${process.env.API_VERSION}/products`
            }
        }


        return res.status(201).send(
            customResponse({
                success: true,
                error: false,
                message: 'Successfully created new product',
                status: 201,
                data,
            })
        )

    } catch (error) {
        console.log(error);
        next(error)

    }
}

const httpGetProductsService = async function (req, res, next) {
    try {
        const products = await allProduct()
        // console.log(products);

        const responseObj = products.map((productDoc) => {
            const product = productDoc.get({ plain: true })
            return {
                ...product,
                request: {
                    type: 'Get',
                    description: 'Get One Product with the id: ',
                    url: `${process.env.API_URL}/api/${process.env.API_VERSION}/products/${product.id}`
                }
            }
        })

        return res.status(200).send(responseObj)
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const httpGetProdcutDescService = async function (req, res, next) {
    try {

        let productId = req.params.id
        let productDetail = await productById(productId)

        if (!productDetail) return next(new createHttpError.BadRequest())

        const responseObj = {
            product: {
                ...productDetail.get({ plain: true }),
                request: {
                    type: 'Get',
                    description: 'Get all the products',
                    url: `${process.env.API_URL}/api/${process.env.API_VERSION}/products`
                }
            }
        }

        return res.status(200).send(
            customResponse({
                success: true,
                error: false,
                message: `Successfully found product by Id ${productId}`,
                status: 200,
                data: responseObj,
            })
        )

    } catch (error) {
        console.log(error);
        // return res.status(500).json({ message: "Internal Server Error" })
        return next(createHttpError.InternalServerError)
    }
}


const httpGetProductByCategoryService = async function (req, res, next) {
    try {

        let categoryType = req.params.type

        let products = await productByCategory(categoryType)

        let responseObj = products.map((productDoc) => {
            return {
                product: {
                    ...productDoc.get({ plain: true }),
                    request: {
                        type: 'Get',
                        description: 'Get One Product with the id',
                        url: `${process.env.API_URL}/api/${process.env.API_VERSION}/products/${productDoc.id}`
                    }
                }

            }
        })

        return res.status(200).send(
            customResponse({
                success: true,
                error: false,
                message: `Successfully found all Products for category ${categoryType}`,
                status: 200,
                data: responseObj,
            })
        )

    } catch (error) {
        // console.log(error);
        // return res.status(500).json({ message: "Internal Server Error" })
        return next(createHttpError.InternalServerError)
    }
}

// -------------
const httpPutWishListService = async function (req, res, next) {
    try {
        const { id } = req.user // customerId
        const product = await productById(req.body.id)

        if (!product) { throw createHttpError.NotFound('Product Not Found') }

        // const customerProfile = await addWishListItem(id, product)
        const wishListResult = await addWishListItem(id, product)

        const message = `Product ${product.name} added from wishlist`

        // return res.status(200).send(
        //     customResponse({
        //         success: true,
        //         error: false,
        //         message,
        //         status: 200,
        //         data: {
        //             user: customerProfile,
        //         },
        //     })
        // )
        return res.status(200).send(wishListResult)

    } catch (error) {
        console.log(error);
        next(error)

    }
}

const httpDeleteWishListService = async function (req, res, next) {
    try {
        const { id } = req.user // customerId
        const product = await productById(req.params.id)

        if (!product) { throw createHttpError.NotFound('Product Not Found') }

        // const customerProfile = await addWishListItem(id, product)
        const wishListResult = await addWishListItem(id, product)

        const message = `Product ${product.name} remove from wishlist`

        // return res.status(200).send(
        //     customResponse({
        //         success: true,
        //         error: false,
        //         message,
        //         status: 200,
        //         data: {
        //             user: customerProfile,
        //         },
        //     })
        // )

        return res.status(200).send(wishListResult)

    } catch (error) {
        console.log(error);
        next(error)

    }
}

const httpAddItemToCartService = async function (req, res, next) {
    try {
        const { id, qty } = req.body

        const product = await productById(id)
        if (!product) return next(createHttpError.BadRequest('Invalid Product Id'))

        const updatedUser = await addCartItem(req.user.id, product, qty, false)

        const cartItem = updatedUser.cartItems.find(item => item.id === product.id)

        if (!cartItem) {
            return next(createHttpError.InternalServerError("Product not found in cart"))
        }

        const data = {
            product: {
                id: cartItem.id,
                name: cartItem.name,
                desc: cartItem.desc,
                banner: cartItem.banner,
                type: cartItem.type,
                unit: product.unit,
                price: cartItem.price,
                available: cartItem.available,
                supplier: cartItem.supplier,
                createdAt: cartItem.createdAt,
                updatedAt: cartItem.updatedAt,
            },
            unit: cartItem.Cart.unit
        }

        // return res.status(200).send(
        //     customResponse({
        //         success: true,
        //         error: false,
        //         message: `Successfully added product to cart: ${id}`,
        //         status: 201,
        //         data
        //     })
        // )
        return res.status(200).send(cartItem)
    } catch (error) {
        console.log(error)
        next(error)
    }
}


const httpDeleteItemFromCartService = async function (req, res, next) {
    try {
        const { id } = req.user
        const product = await productById(req.params.id)

        if (!product) {
            return next(new createHttpError.BadRequest())
        }

        const updatedUser = await addCartItem(id, product, 0, true)

        const data = {
            user: updatedUser,
        }
        // return res.status(200).send(
        //     customResponse({
        //         success: true,
        //         error: false,
        //         message: `Successfully remove item: ${req.params.id} from the cart`,
        //         status: 200,
        //         data
        //     })
        // )

        return res.status(200).send(product)
    } catch (error) {
        console.log(error);
        // return res.status(500).json({ message: "Internal Server Error" })
        return next(error)
    }
}


const httpSeedProductsService = async (req, res, next) => {
    try {
        const sampleProducts = [
            {
                name: 'Almond Oil',
                desc: 'Pure almond oil for cooking',
                banner: `${process.env.API_URL}/static/images/Almond_Oil.jpg`,
                type: 'oils',
                unit: 1,
                price: 350,
                available: true,
                supplier: 'Organic Farm Co.'
            },
            {
                name: 'Coconut Oil',
                desc: 'Cold-pressed coconut oil',
                banner: `${process.env.API_URL}/static/images/Coconut_Oil.jpg`,
                type: 'oils',
                unit: 1,
                price: 250,
                available: true,
                supplier: 'Natural Essentials'
            },
            {
                name: 'Groundnut Oil',
                desc: 'Healthy groundnut oil',
                banner: `${process.env.API_URL}/static/images/Groundnut_Oil.jpg`,
                type: 'oils',
                unit: 1,
                price: 300,
                available: true,
                supplier: 'Agro Fresh'
            },
            {
                name: "Alphonso Mango",
                desc: "Great quality of mango",
                type: "fruits",
                banner: `${process.env.API_URL}/static/images/Alphonso_Mango.jpg`,
                unit: 1,
                price: 300,
                available: true,
                supplier: "Golden seed firming"
            },
            {
                name: "Apples",
                desc: "Great quality of apple",
                type: "fruits",
                banner: `${process.env.API_URL}/static/images/Apples.jpg`,
                unit: 1,
                price: 140,
                available: true,
                supplier: "Golden seed firming"
            },
            {
                name: "Kesar Mango",
                desc: "Great quality of mango",
                type: "fruits",
                banner: `${process.env.API_URL}/static/images/Kesar_Mango.jpg`,
                unit: 1,
                price: 170,
                available: true,
                supplier: "Golden seed firming"
            },
            {
                name: "Langra Mango",
                desc: "Great quality of mango",
                type: "fruits",
                banner: `${process.env.API_URL}/static/images/Langra_Mango.jpg`,
                unit: 1,
                price: 280,
                available: true,
                supplier: "Golden seed firming"
            },
            {
                name: "Broccoli",
                desc: "Fresh quality vegetable",
                type: "vegetables",
                banner: `${process.env.API_URL}/static/images/Broccoli.JPG`,
                unit: 1,
                price: 280,
                available: true,
                supplier: "Golden seed firming"
            },
            {
                name: "Cauliflower",
                desc: "Fresh quality vegetable",
                type: "vegetables",
                banner: `${process.env.API_URL}/static/images/Cauliflower.jpg`,
                unit: 1,
                price: 280,
                available: true,
                supplier: "Golden seed firming"
            },
            {
                name: "Olive Oil",
                desc: "Great quality of oil",
                type: "oils",
                banner: `${process.env.API_URL}/static/images/Olive_Oil.jpg`,
                unit: 1,
                price: 400,
                available: true,
                supplier: "Golden seed firming"
            }
        ];

        const created = await PRODUCT.bulkCreate(sampleProducts, { validate: true });

        return res.status(201).send(
            customResponse({
                success: true,
                error: false,
                message: 'Sample products added successfully',
                status: 201,
                data: created
            })
        );
    } catch (error) {
        console.error(error);
        next(createHttpError.InternalServerError('Failed to seed sample products'));
    }
};


const httpGetProductFromRedisController = async (req, res, next) => {
    try {
        const startTime = Date.now(); // ⏱️ Start timing

        const cacheKey = 'all-products';
        const cached = await getDataFromRedis(cacheKey);

        let source = 'cache';
        let products = cached;

        if (!cached) {
            products = await allProduct();
            await setDataToRedis(cacheKey, products, 60);
            source = 'database';
        }

        const endTime = Date.now(); // ⏱️ End timing
        const responseTime = endTime - startTime; // in milliseconds

        return res.status(200).send({
            fromCache: source === 'cache',
            data: products,
            responseTime, // 📦 Add this
            source
        });

    } catch (error) {
        console.log(error);
        return next(error);
    }
}


module.exports = {
    httpCreateProductService,
    httpGetProductsService,
    httpGetProdcutDescService,
    httpGetProductByCategoryService,

    httpPutWishListService,
    httpDeleteWishListService,
    httpAddItemToCartService,
    httpDeleteItemFromCartService,

    httpSeedProductsService,

    httpGetProductFromRedisController,
}