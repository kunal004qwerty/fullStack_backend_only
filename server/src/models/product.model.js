const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/index')

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    banner: DataTypes.STRING,
    type: DataTypes.STRING,
    unit: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    available: DataTypes.BOOLEAN,
    supplier: { type: DataTypes.STRING, allowNull: false }
}, {
    timestamps: true
})

module.exports = {
    Product
}