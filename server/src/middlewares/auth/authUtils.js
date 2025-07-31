const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//  utility_Functions

const generateSalt = async function () {
    return await bcrypt.genSalt();
};

const generatePassword = async function (password, salt) {
    return bcrypt.hash(password, salt)
}

const validatePassword = async function (enteredPassword, savedPassword, salt) {
    return await generatePassword(enteredPassword, salt) === savedPassword
}

const generateSignature = async function (payload) {
    try {
        return await jwt.sign(payload, process.env.APP_SECRET, { expiresIn: '30d' })
    } catch (error) {
        console.log(error);
        // return error
        // throw error
    }
}


const validateSignature = async function (req) {

    try {

        // console.log(req);
        // console.log("Headers:", req.headers);
        // console.log("Body:", req.body);
        

        const signature = req.get('Authorization')

        // console.log("signature", signature);
        

        const payload = await jwt.verify(signature.split(" ")[1], process.env.APP_SECRET)

        req.user = payload
        return true
    } catch (error) {
        console.log(error);
        return false

    }
}

module.exports = {
    generateSalt,
    generatePassword,
    validatePassword,
    generateSignature,
    validateSignature,
}