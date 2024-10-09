import { createClient } from 'redis';

async function setData() {
  const client = createClient();

  try {
    await client.connect();
    console.log('Redis client connected to the server');

    const schools = {
      Portland: 50,
      Seattle: 80,
      'New York': 20,
      Bogota: 20,
      Cali: 40,
      Paris: 2,
    };

    for (const [city, value] of Object.entries(schools)) {
      const reply = await client.hSet('HolbertonSchools', city, value);
      console.log(`Reply: ${reply}`);
    }

    const userData = await client.hGetAll('HolbertonSchools');
    console.log(userData);

    await client.quit();
  } catch (err) {
    console.log('Redis client not connected to the server:', err);
  }
}

setData();
