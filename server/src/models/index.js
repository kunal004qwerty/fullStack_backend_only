const { Customer } = require('./customer.model')
const { Address } = require('./address.model')
const { sequelize } = require('../config')
const { DataTypes } = require('sequelize')
const { Product } = require('./product.model')
const { Order } = require('./order.model')
const { EmailLog } = require('./emailLog.model')

// Address: Many Addresses can belong to one Customer
Customer.hasMany(Address, {
    foreignKey: { name: 'customerId', allowNull: false }
})
Address.belongsTo(Customer, {
    foreignKey: { name: 'customerId', allowNull: false }
})



/*

     Customer Cart (Many-to-Many through Cart)

    A customer to have multiple products in their cart
    Each product in the cart to store unit (quintity)
    A many-to-many relationship btween Customer and Product, with extra data (unit) in the join table


*/
const Cart = sequelize.define('Cart', {
    unit: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
})

Customer.belongsToMany(Product, {
    through: Cart,
    as: 'cartItems',
    foreignKey: 'customerId',
    otherKey: 'productId'
})
Product.belongsToMany(Customer, {
    through: Cart,
    as: 'inCartsof',
    foreignKey: 'productId',
    otherKey: 'customerId'
})

/*

    Customer Wishlist (Many-to-Many through Wishlist)


    You (Customer A) can add Product X, Product Y to your wishlist.
    I (Customer B) can also add Product X and Product Z to my wishlist.

    A single product can appear in many customers' wishlists.
    A single customer can have many products in their wishlist.
    
    That's many-to-many

    we dont need to create a seperate model for wishlist  unless you want extra info
    it  going to create a join table for us
*/
Customer.belongsToMany(Product, {
    through: 'Wishlists',
    as: 'wishlistItems',
    foreignKey: 'customerId',
    otherKey: 'productId'
})
Product.belongsToMany(Customer, {
    through: 'Wishlists',
    as: 'wishlistedBy',
    foreignKey: 'productId',
    otherKey: 'customerId',
})

/*
    Customer-> order(one-to-Many)

    one customer can place many orders
    exach order belong to one customer

 */
Customer.hasMany(Order, { foreignKey: 'customerId' })
Order.belongsTo(Customer, { foreignKey: 'customerId' })

/*

    Order -> Product (OrderItem) --- Many-to-Many with extra field Unit
    
    One order can have many products.
    A product can belong to many orders.
    Each product in an order also needs a unit (quantity).
    You need a custom join table OrderItem.

    */
const OrderItem = sequelize.define('OrderItem', {
    unit: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

Order.belongsToMany(Product, {
    through: 'OrderItem',
    as: 'products',
    foreignKey: 'orderId',
    otherKey: 'productId'
})

Product.belongsToMany(Order, {
    through: 'OrderItem',
    as: 'orders',
    foreignKey: 'productId',
    otherKey: 'orderId'
})


module.exports = {
    CUSTOMER: Customer,
    ADDRESS: Address,
    PRODUCT: Product,
    ORDER: Order,
    CART: Cart,
    ORDERITEM: OrderItem,
    EMAILLOG: EmailLog, // <-- Add this
}