const redis = require('redis');

const RedisClient = redis.createClient({
    url: 'redis://localhost:6379'
});

RedisClient.on('error', (err) => {
    console.log('Redis error:', err?.message);
});

async function connectRedis() {
    await RedisClient.connect();
    console.log('✅ Redis connected');

    // const pong = await RedisClient.ping()
    // console.log('Redis PING response:', pong); // should print 'PONG'


    // await RedisClient.set('test-key', 'Hello Redis!');
    // const value = await RedisClient.get('test-key');
    // console.log('Redis test value:', value); // should print "Hello Redis!"
}

module.exports = {
    RedisClient,
    connectRedis
};
