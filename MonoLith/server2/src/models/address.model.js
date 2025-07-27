const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/index')


const Address = sequelize.define('Address', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    street: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true
    },
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    postalCode: DataTypes.STRING,

}, {
    // sequelize,
    tableName: 'addresses',
    timestamps: true,
    indexes: [
        {
            name: "PRIMARY",
            unique: true,
            using: 'BTREE',
            fields: [
                { name: 'id' }
            ]
        },
        {
            name: 'customerId',
            using: 'BTREE',
            fields: [
                { name: 'customerId' }
            ]
        }
    ]
})

module.exports = {
    Address,
}