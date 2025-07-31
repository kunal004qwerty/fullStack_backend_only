
async function sendWelcomeEmail(email, phone) {
    console.log(`📨 [Simulated Email] To: ${email}`);
    console.log(`📱 Phone: ${phone}`);
    console.log(`👋 Welcome! Thanks for signing up.`);

}

module.exports = {
    sendWelcomeEmail,
}