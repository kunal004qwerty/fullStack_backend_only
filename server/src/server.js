const http = require('http')
const { app } = require('./app')
const { mongoConnect, connectDB, environmentConfig } = require('./config')
const { mySqlConnect, mySqlDisconnect } = require('./config')
const { logger } = require('./logger')
const { connectRabbitMQ } = require('./config/rabbitMq')
const { startConsumer } = require('./config/rabbitmqConsumer')
const { connectRedis } = require('./config/redis')

const PORT = environmentConfig.PORT || 8000

const MONGO_URI = environmentConfig.NODE_ENV === 'testing'
    ? environmentConfig.TEST_ENV_MONGODB_CONNECTION_STRING
    : environmentConfig.MONGODB_CONNECTION_STRING

const server = http.createServer(app)

// console.log(environmentConfig);


// async function startServer() {
//     try {
//         // const conn = await mongoConnect(MONGO_URI)
//         const conn = await connectDB(MONGO_URI)

//         // console.log(`MongoDB database connection establish successfully to ... ${conn?.connection?.host}`.cyan.underline);
//         console.log(`MongoDB database connection establish successfully to ... ${conn?.connection?.host}`);

//         // start the server
//         server.listen(PORT, () => {
//             // console.log(`Server is listening on port: http://localhost:${PORT} ....`.inverse);
//             console.log(`Server is listening on port: http://localhost:${PORT} ....`);
//         })
//     } catch (error) {
//         console.log('MongoDb connection error. Please make sure MongoDB is running: ');

//         logger.error({
//             message: `MongoDB connection error. Please make sure MongoDB is running: ${error?.message}`,
//         })

//     }
// }




// async function startServer() {
//     try {

//         const conn = await mySqlConnect()
//         // await conn.sync({alter: true})
//         // console.log(conn);  // if sequelize.sync()

//         // console.log(`MongoDB database connection establish successfully to ... ${conn?.config?.host}`.cyan.underline);
//         console.log(`mySql  database connection establish successfully to ... ${conn?.config?.host}`);


//         // // RabbitMQ connection
//         // await connectRabbitMQ();
//         // console.log('✅ RabbitMQ connected');


//         // start the server
//         server.listen(PORT, () => {
//             // console.log(`Server is listening on port: http://localhost:${PORT} ....`.inverse);
//             console.log(`Server is listening on port: http://localhost:${PORT} ....`);
//         })
//     } catch (error) {
//         console.log('MySql_DB connection error. Please make sure MySql_DB is running: ');


//         logger.error({
//             message: `MySql_DB connection error. Please make sure MySql_DB is running: ${error?.message}`,
//         })

//     }
// }


async function startServer() {
    try {
        // MySQL connection
        const conn = await mySqlConnect();
        console.log(`✅ MySQL connected to ${conn?.config?.host}`);

        // Redis connection
        await connectRedis(); // ✅ Required

        // RabbitMQ connection
        await connectRabbitMQ();
        console.log('✅ RabbitMQ connected');

        // ramitMqConsumer
        await startConsumer()
        console.log("Consumer listening");


        // Start server
        server.listen(PORT, () => {
            console.log(`🚀 Server running at: http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Error while starting server:', error?.message);

        logger.error({
            message: `Startup error: ${error?.message}`,
        });
    }
}

startServer()
