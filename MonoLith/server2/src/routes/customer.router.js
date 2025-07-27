const express = require('express')

const { isAuth } = require('../middlewares/auth/isAuth')
const { signUpController, addressController, getAllCustomerController, getAllCustomerDetailsController,
    loginController, profileController, shoppingDetailController, wishListController, getAllEmailsController } = require('../controllers/customer.controller')

const customerRouter = express.Router()

// /customer
customerRouter.post('/signup', signUpController)
customerRouter.post('/login', loginController)

customerRouter.post('/address', isAuth, addressController)

customerRouter.get('/allCustomers', getAllCustomerController)
customerRouter.get('/allCustomersDetails', getAllCustomerDetailsController)

customerRouter.get('/profile', isAuth, profileController)
customerRouter.get('/shopping-details', isAuth, shoppingDetailController)
customerRouter.get('/wishlist', isAuth, wishListController)

customerRouter.get('/email', isAuth, getAllEmailsController)

module.exports = {
    customerRouter,
}