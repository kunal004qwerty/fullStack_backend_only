const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/index')

const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    email: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true,
    },
},
    {
        timestamps: true
    }

)

module.exports = {
    Customer,
}