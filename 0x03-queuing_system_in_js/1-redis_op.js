import { createClient } from 'redis';

async function connectToRedis() {
  const client = createClient();

  try {
    await client.connect();
    console.log('Redis client connected to the server');
    return client;
  } catch (err) {
    console.log('Redis client not connected to the server:', err);
    return null;
  }
}

async function setNewSchool(schoolName, value) {
  const redisClient = await connectToRedis();
  const reply = await redisClient.set(schoolName, value);
  console.log(`Reply: ${reply}`);
}

async function displaySchoolValue(schoolName) {
  const redisClient = await connectToRedis();
  const value = await redisClient.get(schoolName);
  console.log(value);
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
