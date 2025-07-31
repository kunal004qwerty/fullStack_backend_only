const { httpSignUpService, httpAddressService, httpProfileService, httpGetAllCustomer, httpGetAllCustomerDetails,
    httpLoginService, httpShoppingDetailsService, httpWishListService, httpGetAllEmail } = require("../services/customer.service")

const signUpController = (req, res, next) => httpSignUpService(req, res, next)
const loginController = (req, res, next) => httpLoginService(req, res, next)

const getAllCustomerController = (req, res, next) => httpGetAllCustomer(req, res, next)
const getAllCustomerDetailsController = (req, res, next) => httpGetAllCustomerDetails(req, res, next)


const addressController = (req, res, next) => httpAddressService(req, res, next)

const profileController = (req, res, next) => httpProfileService(req, res, next)

const shoppingDetailController = (req, res, next) => httpShoppingDetailsService(req, res, next)

const wishListController = (req, res, next) => httpWishListService(req, res, next)

const getAllEmailsController = (req, res, next) => httpGetAllEmail(req, res, next)

module.exports = {
    signUpController,
    loginController,

    addressController,
    profileController,
    shoppingDetailController,
    wishListController,

    getAllCustomerController,
    getAllCustomerDetailsController,

    getAllEmailsController,
}