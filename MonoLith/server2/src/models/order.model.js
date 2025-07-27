const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/index')

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    orderId: DataTypes.STRING,
    customerId: DataTypes.UUID,
    amount: DataTypes.FLOAT,
    status: DataTypes.STRING,
    txnId: DataTypes.STRING,
}, {
    timestamps: true
})

module.exports = {
    Order
}