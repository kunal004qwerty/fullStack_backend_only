const createHttpError = require('http-errors')
const { PRODUCT } = require('../models')


const createProduct = async function (data) {
    try {
        const product = await PRODUCT.create(data)
        return product
    } catch (error) {
        throw createHttpError(400, `Failed to create product: ${error.message}`)
    }
}

const allProduct = async function () {
    try {
        return await PRODUCT.findAll()
    } catch (error) {
        throw createHttpError(400, `Failed to create product: ${error.message}`)
    }
}

const productById = async function (id) {
    return await PRODUCT.findOne({ where: { id } })
}

const productByCategory = async function (cat) {
    return await PRODUCT.findAll({ where: { type: cat } })
}

module.exports = {
    createProduct,
    allProduct,
    productById,
    productByCategory,
}