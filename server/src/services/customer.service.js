const createHttpError = require("http-errors")
const { generateSalt, generatePassword, generateSignature, validatePassword } = require("../middlewares/auth/authUtils")
const { createCustomer, createAddress, allCustomerData, allCustomerDetails, findCustomer, findCustomerById, getUserEmails } = require("../repository/customer-repository")
const { customResponse } = require("../utils")
const { sendToQueue } = require("../config/rabbitMq")

const httpSignUpService = async function (req, res, next) {
    try {

        console.log(req.body);

        const { email, password, phone, role } = req.body
        const salt = await generateSalt()
        const userPassword = await generatePassword(password, salt)
        const userRole = role == 'admin' ? 'admin' : 'user'

        const userDetail = {
            email, userPassword, phone, salt, role: userRole
        }

        // console.log(userDetail);

        const customer = await createCustomer(userDetail)

        //------------------------ for RabbitMq

        sendToQueue({
            type: 'SEND_SIGNUP_EMAIL',
            payload: { email, phone }
        })

        // store in db for frontend to show



        // -----------------------



        // console.log(customer);
        const token = await generateSignature({ email, id: customer.id })

        let data = {
            user: {
                token: token,
                id: customer.id,
            }
        }

        // console.log(data);


        return res.status(201).send(

            customResponse({
                data,
                success: true,
                error: false,
                message: `Auth SIgnup is success. An Email with Verification link has been sent to your account ${customer.email} Please Verify Your Emial first or use the email verification link which has been send send with the response body to verfiy your email`,
                status: 201,
            })

        )


    } catch (error) {
        console.log(error);
        // return res.status(500).send({
        //     message: "Internal server error"
        // })
        return next(createHttpError.InternalServerError)
    }
}

const httpLoginService = async function (req, res, next) {
    try {
        const { email, password } = req.body
        const existingCutomer = await findCustomer(email)

        // console.log("existingCutomer", existingCutomer);


        // 401 Unauthorized
        if (!existingCutomer) {
            return next(createHttpError(401, 'Auth Failed (Invalid Credentials)'))
        }
        // compare Password
        const isPasswordCorrect = await validatePassword(password, existingCutomer.password, existingCutomer.salt)

        if (!isPasswordCorrect) {
            return next(createHttpError(401, 'Auth Failed (Invalid Credentials)'))
        }

        let token = await generateSignature({
            email: existingCutomer.email,
            id: existingCutomer.id
        })

        let data = {
            token,
            user: existingCutomer,
        }

        return res.status(200).send(
            customResponse({
                success: true,
                error: false,
                message: 'Auth logged in successfull.',
                status: 200,
                data,
            })
        )

    } catch (error) {
        // return res.status(500).send({ message: "Internal Server Error" })
        return next(error)
    }
}

const httpGetAllCustomer = async function (req, res, next) {
    try {
        const data = await allCustomerData()
        // console.log(data);


        return res.status(200).send(data)
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" })
        // return next(error)
    }
}

const httpGetAllCustomerDetails = async function (req, res, next) {
    try {
        const data = await allCustomerDetails()
        return res.status(200).send(data)
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" })
        // return next(error)
    }
}

const httpAddressService = async function (req, res, next) {
    try {

        const { id } = req.user
        const { street, postalCode, city, country } = req.body
        const userAddress = {
            customerId: id,
            street, postalCode, city, country
        }
        const customer = await createAddress(userAddress)

        let data = { user: customer }
        // console.log(data);


        return res.status(201).send(data)

    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" })
        // return next(error)
    }
}

const httpProfileService = async function (req, res, next) {
    try {

        const { id } = req.user
        const customer = await findCustomerById(id)

        return res.status(200).send(customer)

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Internal Server Error" })
    }
}

const httpShoppingDetailsService = async function (req, res, next) {
    try {

        const { id } = req.user
        const customer = await findCustomerById(id)

        return res.status(200).send(customer)

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Internal Server Error" })
    }
}

const httpWishListService = async function (req, res, next) {
    try {

        const { id } = req.user
        const customer = await findCustomerById(id)

        return res.status(200).send(customer)

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Internal Server Error" })
    }
}


const httpGetAllEmail = async function (req, res, next) {
    try {
        const { id } = req.user
        const customer = await findCustomerById(id)

        const data = await getUserEmails()
        // console.log(data);
        

        return res.status(200).send(data)


    } catch (error) {
        console.log(error);
        
        return res.status(500).send({ message: "Internal Server Error" })

    }
}

module.exports = {
    httpSignUpService,
    httpLoginService,

    httpAddressService,
    httpProfileService,
    httpShoppingDetailsService,
    httpWishListService,

    httpGetAllCustomer,
    httpGetAllCustomerDetails,

    httpGetAllEmail,
}