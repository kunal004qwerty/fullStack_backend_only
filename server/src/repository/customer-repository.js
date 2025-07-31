const createHttpError = require("http-errors")
const { CUSTOMER, ADDRESS, PRODUCT, CART, ORDER, EMAILLOG } = require('../models')

const createCustomer = async function (userDetail) {
    try {

        let { email, userPassword: password, phone, salt, role, ...rest } = userDetail
        let data = await CUSTOMER.create({ email, password, phone, salt, role })
        return data
        // console.log(data);

    } catch (error) {
        throw createHttpError(400, `Failed to SignUp: ${error.message}`)
    }
}

const findCustomer = async function (email) {
    try {
        const Customer = await CUSTOMER.findOne({ where: { email } })
        return Customer

    } catch (error) {
        throw createHttpError(400, `Failed to SignUp: ${error.message}`)
    }
}

const findCustomerById = async function (id) {
    try {
        const Customer = await CUSTOMER.findOne({
            where: { id },
            include: [
                {
                    model: ADDRESS,
                    // as: 'Addresses' // only if you've aliased it, otherwise remove `as`
                },
                {
                    model: PRODUCT,
                    as: 'cartItems',
                    through: { attributes: ['unit'] }
                },
                {
                    model: PRODUCT,
                    as: 'wishlistItems',
                    through: { attributes: [] }
                },
                {
                    model: ORDER,
                    include: {
                        model: PRODUCT,
                        as: 'products',
                        through: { attributes: ['unit'] }
                    }
                }
            ]
        })
        return Customer

    } catch (error) {
        throw createHttpError(400, `Failed to find customer: ${error.message}`)
    }
}

const allCustomerData = async function () {
    try {
        const customers = await CUSTOMER.findAll()
        return customers
    } catch (error) {
        throw createHttpError(400, `Failed to Find Data: ${error.message}`)

    }
}


const allCustomerDetails = async function () {
    try {
        const customers = await CUSTOMER.findAll({
            include: [
                {
                    model: ADDRESS,
                    as: 'Addresses' // only if you've aliased it, otherwise remove `as`
                },
                // {
                //     model: PRODUCT,
                //     as: 'cartItems',
                //     through: { attributes: ['unit'] }
                // },
                // {
                //     model: PRODUCT,
                //     as: 'wishlistItems',
                //     through: { attributes: [] }
                // }
            ]
        })

        return customers
    } catch (error) {
        throw createHttpError(400, `Failed to Find Data: ${error.message}`)
    }
}


const createAddress = async function (data) {
    try {

        console.log(data);
        let customerProfile = await CUSTOMER.findByPk(data?.customerId)

        if (customerProfile) {
            const newAddress = await ADDRESS.create(data)
            return newAddress
        }

        return data
    } catch (error) {
        console.log(error);
        throw createHttpError(400, `Failed to Add address: ${error.message}`)
    }
}


const getUserEmails = async function (id) {
    try {
        const res = await EMAILLOG.findAll()
        return res
    } catch (error) {
        console.log(error);

    }

}


// ---------------
const addWishListItem = async (customerId, product) => {
    const customer = await CUSTOMER.findByPk(customerId, {
        include: {
            model: PRODUCT,
            as: 'wishlistItems',
            through: { attributes: [] }, // Don't include join table columns
        },
    })

    if (!customer) {
        throw createHttpError.NotFound('Customer not found')
    }

    // Check if product already in wishlist
    const alreadyWishlisted = customer.wishlistItems.some(
        (item) => item.id === product.id
    )

    if (alreadyWishlisted) {
        // Remove product from wishlist
        await customer.removeWishlistItem(product)
    } else {
        // Add product to wishlist
        await customer.addWishlistItem(product)
    }

    // Return updated customer with wishlist
    const updatedCustomer = await CUSTOMER.findByPk(customerId, {
        include: {
            model: PRODUCT,
            as: 'wishlistItems',
            through: { attributes: [] },
        },
    })

    // return updatedCustomer
    return product
}

const addCartItem = async (customerId, product, qty, isRemove) => {
    try {
        const customer = await CUSTOMER.findByPk(customerId, {
            include: {
                model: PRODUCT,
                as: 'cartItems',
                through: { attributes: ['unit'] }
            }
        })

        if (!customer) throw createHttpError.NotFound('Customer not found')

        const existingItem = await CART.findOne({
            where: {
                customerId: customer.id,
                productId: product.id
            }
        })

        if (existingItem) {
            if (isRemove) {
                await existingItem.destroy()
            } else {
                existingItem.unit = qty
                await existingItem.save()
            }
        } else {
            await CART.create({
                customerId: customer.id,
                productId: product.id,
                unit: qty
            })
        }

        // return updated cart
        const updatedCustomer = await CUSTOMER.findByPk(customerId, {
            include: {
                model: PRODUCT,
                as: 'cartItems',
                through: { attributes: ['unit'] }
            }
        })

        return updatedCustomer
    } catch (error) {
        console.log(error)
        throw createHttpError.InternalServerError(`Failed to add cart item: ${error.message}`)
    }
}


module.exports = {
    createCustomer,
    findCustomer,
    findCustomerById,

    createAddress,

    allCustomerData,
    allCustomerDetails,


    addWishListItem,
    addCartItem,

    getUserEmails,


}