require('dotenv').config()

const environmentConfig = {
    // --
    PORT: process.env.PORT,

    // mongoDb
    MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING,
    TEST_ENV_MONGODB_CONNECTION_STRING: process.env.TEST_ENV_MONGODB_CONNECTION_STRING,

    // --
    API_URL: process.env.API_URL,
    API_VERSION: process.env.API_VERSION,

    //---
    NODE_ENV: process.env.NODE_ENV,
    APP_SECRET: process.env.APP_SECRET,

    MYSQL: {
        HOST: process.env.MYSQL_DATABASE_HOST,
        PORT: process.env.MYSQL_DATABASE_PORT,
        USER: process.env.MYSQL_DATABASE_USER,
        DATABASE: process.env.MYSQL_DATABASE_NAME,
        PASSWORD: process.env.MYSQL_DATABASE_PASSWORD,
    },

}

module.exports = {
    environmentConfig
}