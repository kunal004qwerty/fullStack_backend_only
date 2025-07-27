const { RedisClient } = require('./redis');

const getDataFromRedis = async (key) => {
    try {
        const cachedData = await RedisClient.get(key);
        if (cachedData) {
            console.log(`🧠 Redis Hit → Key: ${key}`);
            return JSON.parse(cachedData);
        } else {
            console.log(`🚫 Redis Miss → Key: ${key}`);
            return null;
        }
    } catch (error) {
        console.log(`❌ Redis Get Error → Key: ${key}, Error: ${error.message}`);
    }
};

const setDataToRedis = async (key, data, cacheDuration = 3600) => {
    try {
        await RedisClient.setEx(key, cacheDuration, JSON.stringify(data));
        console.log(`💾 Redis Set → Key: ${key}, TTL: ${cacheDuration}s`);
    } catch (error) {
        console.log(`❌ Redis Set Error → Key: ${key}, Error: ${error.message}`);
    }
};

const invalidateKey = async (key) => {
    try {
        await RedisClient.del(key);
        console.log(`🗑️ Redis Key Deleted → Key: ${key}`);
    } catch (error) {
        console.log(`❌ Redis Delete Error → Key: ${key}, Error: ${error.message}`);
    }
};


module.exports = {
    getDataFromRedis,
    setDataToRedis,
    invalidateKey,
}