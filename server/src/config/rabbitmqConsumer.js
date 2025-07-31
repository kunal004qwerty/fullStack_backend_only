const amqp = require('amqplib');
const { sendWelcomeEmail } = require('../services/email.service');

async function startConsumer() {
    const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await connection.createChannel();
    await channel.assertQueue('taskQueue');

    console.log(`📥 Waiting for messages in taskQueue...`);

    channel.consume('taskQueue', async (msg) => {
        if (msg !== null) {
            const data = JSON.parse(msg.content.toString());
            console.log('📨 Received:', data);

            if (data.type === 'SEND_SIGNUP_EMAIL') {
                const { email, phone } = data.payload;
                await sendWelcomeEmail(email, phone);
            }

            channel.ack(msg);
        }
    });
}

// startConsumer();
module.exports ={
    startConsumer,
}
