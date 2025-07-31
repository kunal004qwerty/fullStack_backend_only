const mongoose = require('mongoose')


const isValidMongooseObjectId = (id) => mongoose.isValidObjectId(id)

module.exports = { isValidMongooseObjectId, }