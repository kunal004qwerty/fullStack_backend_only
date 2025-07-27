const createHttpError = require("http-errors");
const { createNewOrder } = require("../repository/shopping-repository");
const { customResponse } = require("../utils");
const { findCustomerById } = require("../repository/customer-repository");



const httpPlaceOrderService = async function (req, res, next) {
    const { id: customerId } = req.user;
    const { txnNumber: txnId } = req.body;

    try {
        const customerOrder = await createNewOrder(customerId, txnId);

        return res.status(200).send(
            customResponse({
                success: true,
                error: false,
                message: `Thank you, your orders will be shipped in 2-3 business days`,
                status: 201,
                data: { order: customerOrder }
            })
        );
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const httpOrderDetailService = async function (req, res, next) {
    const { id } = req.user
    try {
        const user = await findCustomerById(id)

        const data = {
            orders: user.Orders // capital O (default plural from model name)
        }

        return res.status(200).send(
            customResponse({
                success: true,
                error: false,
                message: `Successfully Found all your orders`,
                status: 200,
                data
            })
        )
    } catch (error) {
        console.log(error)
        return next(createHttpError.InternalServerError)
    }
}

const httpCartDetailService = async function (req, res, next) {
    const { id } = req.user
    try {
        const user = await findCustomerById(id)

        const data = {
            products: user.cartItems.map(product => ({
                ...product.dataValues,
                unit: product.Cart.unit // access quantity from join table
            })),
            userId: id
        }

        return res.status(200).send(
            customResponse({
                success: true,
                error: false,
                message: `Successfully found cart`,
                status: 200,
                data
            })
        )
    } catch (error) {
        console.log(error)
        return next(error)
    }
}



module.exports = {
    httpCartDetailService,
    httpOrderDetailService,
    httpPlaceOrderService,
}