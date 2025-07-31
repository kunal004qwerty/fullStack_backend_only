const { Sequelize } = require('sequelize')
const { environmentConfig } = require('./custom_environment.config')
const mysql = require('mysql2/promise');

// console.log(environmentConfig);

const sequelize = new Sequelize(
    environmentConfig.MYSQL.DATABASE,
    environmentConfig.MYSQL.USER,
    environmentConfig.MYSQL.PASSWORD,
    {
        dialect: 'mysql',
        host: environmentConfig.MYSQL.HOST,
        port: environmentConfig.MYSQL.PORT,
        logging: false,
        define: {
            timestamps: false,
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
)

async function createDatabaseIfNotExists() {
    const connection = await mysql.createConnection({
        host: environmentConfig.MYSQL.HOST,
        user: environmentConfig.MYSQL.USER,
        password: environmentConfig.MYSQL.PASSWORD,
        port: environmentConfig.MYSQL.PORT,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${environmentConfig.MYSQL.DATABASE}\`;`);
    await connection.end();
}

const mySqlConnect = async function () {
    // const res = await sequelize.sync()
    // const res = await sequelize.authenticate()
    // console.log(res);
    
    // return sequelize
    // return res
    try {
        await createDatabaseIfNotExists()
        const res = await sequelize.sync({ force: true })
        return res
        
    } catch (error) {
        console.log(error);
    }
}

const mySqlDisconnect = async function () {
    if (sequelize) {
        await sequelize.close()
        console.log("MySql Database connection disconnect");
    }
}


module.exports = {
    mySqlConnect,
    mySqlDisconnect,
    sequelize,
}