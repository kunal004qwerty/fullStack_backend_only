const { CUSTOMER, PRODUCT, ORDER, ORDERITEM, CART } = require("../models")
const { v4: uuid } = require('uuid');

const createNewOrder = async function (customerId, txnId) {
    try {

        const customer = await CUSTOMER.findByPk(customerId, {
            include: {
                model: PRODUCT,
                as: 'cartItems',
                through: { attributes: ['unit'] }
            }
        })

        if (!customer || !customer.cartItems.length) {
            throw createHttpError.BadRequest('Cart is empty or customer not found');
        }

        let amount = 0;

        // Calculate total
        customer.cartItems.forEach(item => {
            amount += parseInt(item.price) * parseInt(item.Cart.unit);
        });

        const order = await ORDER.create({
            orderId: uuid(),
            customerId: customer.id,
            amount,
            txnId,
            status: 'received'
        });

        // Add products to the order with quantity
        for (const product of customer.cartItems) {
            await ORDERITEM.create({
                orderId: order.id,
                productId: product.id,
                unit: product.Cart.unit
            });
        }

        // Clear the cart
        await CART.destroy({
            where: { customerId }
        });

        // Return order with products
        const orderWithProducts = await ORDER.findByPk(order.id, {
            include: {
                model: PRODUCT,
                as: 'products',
                through: { attributes: ['unit'] }
            }
        });

        return orderWithProducts;

    } catch (error) {
        console.log(error);
        throw createHttpError.InternalServerError(`Order creation failed: ${error.message}`);
    }
}

module.exports = {
    createNewOrder,
}