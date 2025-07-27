const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
    try {
        // const connection = await amqp.connect('amqp://rabbitmq:5672'); // from Docker
        const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
        channel = await connection.createChannel();
        await channel.assertQueue('taskQueue');
    } catch (error) {
        console.log(error);

    }
}

function sendToQueue(data) {
    if (!channel) throw new Error('RabbitMQ not connected');
    channel.sendToQueue('taskQueue', Buffer.from(JSON.stringify(data)));
}

module.exports = { connectRabbitMQ, sendToQueue };
