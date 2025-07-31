const { EMAILLOG } = require("../models");

async function sendWelcomeEmail(email, phone) {
const subject = 'Welcome to Our App!';
    const message = `Hello, this is a simulated welcome email.`;

    console.log(`📨 [Simulated Email] To: ${email}`);
    console.log(`📱 Phone: ${phone}`);
    console.log(`📝 Message: ${message}`);

    // Save log to DB via Sequelize
    await EMAILLOG.create({
        to_email: email,
        phone,
        subject,
        message
    });

}

module.exports = {
    sendWelcomeEmail,
}