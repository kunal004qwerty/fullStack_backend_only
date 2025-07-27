const { environmentConfig } = require('./custom_environment.config')
const { connectDB, mongoConnect, mongoDisconnect } = require('./db.config')
const { mySqlConnect, mySqlDisconnect, sequelize } = require('./mySql_db.config')

module.exports = {
    environmentConfig,
    connectDB, mongoConnect, mongoDisconnect,
    mySqlConnect, mySqlDisconnect,sequelize

}