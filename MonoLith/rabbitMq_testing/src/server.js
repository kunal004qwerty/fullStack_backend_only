
const http = require('http')
const { app } = require('./app')
const { startConsumer } = require('./rabbitmqConsumer')

const server = http.createServer(app)
const PORT = 7000

async function startServer() {
    try {

        await startConsumer()
        console.log("Consumer listening");
        

        server.listen(PORT, () => {
            console.log(`🚀 Server running at: http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log(error);
        
    }
}

startServer()