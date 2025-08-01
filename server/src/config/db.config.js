const mongoose = require('mongoose')
require('dotenv').config()

// const MONGO_URL = process.env.MONGO_URL

mongoose.connection.once('open', () => {
    console.log('MongoDb connection ready!');
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

const mongoConnect = async function (MONGODB_URI) {
    const res = await mongoose.connect(MONGODB_URI, {})
    return res
}

const mongoDisconnect = async function () {
    await mongoose.disconnect()
}

// --------

// Connecting to MongoDB(Connecting to the Database)
const connectDB = async (MONGODB_URI) => {
    // @event connected: Emitted when this connection successfully connects to the db. May be emitted multiple times in reconnected scenarios
    mongoose.connection.on('connected', () => {
        if (process?.env?.NODE_ENV && process.env.NODE_ENV === 'development') {
            console.log('MongoDB database connection established successfully');
        }
    });

    mongoose.connection.on('reconnected', () => {
        if (process?.env?.NODE_ENV && process.env.NODE_ENV === 'development') {
            console.log('Mongo Connection Reestablished');
        }
    });

    // @event error: Emitted when an error occurs on this connection.
    mongoose.connection.on('error', (error) => {
        if (process?.env?.NODE_ENV && process.env.NODE_ENV === 'development') {
            console.log('MongoDB connection error. Please make sure MongoDB is running: ');
            console.log(`Mongo Connection ERROR: ${error}`);
        }
    });

    // @event close
    mongoose.connection.on('close', () => {
        if (process?.env?.NODE_ENV && process.env.NODE_ENV === 'development') {
            console.log('Mongo Connection Closed...');
        }
    });

    // @event disconnected: Emitted after getting disconnected from the db
    mongoose.connection.on('disconnected', () => {
        if (process?.env?.NODE_ENV && process.env.NODE_ENV === 'development') {
            console.log('MongoDB database connection is disconnected...');
            console.log('Trying to reconnect to Mongo ...');
        }

        setTimeout(() => {
            mongoose.connect(MONGODB_URI, {
                // keepAlive: true,
                // socketTimeoutMS: 3000,
                // connectTimeoutMS: 3000,
                // useNewUrlParser: true,
                // useUnifiedTopology: true,
                // useFindAndModify: true,
                // useCreateIndex: true,
            });
        }, 3000);
    });

    // @event close: Emitted after we disconnected and onClose executed on all of this connections models.
    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            if (process?.env?.NODE_ENV && process.env.NODE_ENV === 'development') {
                console.log('MongoDB database connection is disconnected due to app termination...');
            }

            process.exit(0); // close database connection
        });
    });

    // mongoose.connect return promise
    mongoose.connect(MONGODB_URI, {
        // keepAlive: true,
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    });

    return mongoose.connect(MONGODB_URI);
};


module.exports = {
    mongoConnect,
    mongoDisconnect,
    connectDB,
}