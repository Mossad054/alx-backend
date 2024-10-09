import { createClient } from 'redis';

(async () => {
  const client = createClient();

  try {
    await client.connect();
    console.log('Redis client connected to the server');
  } catch (err) {
    console.log('Redis client not connected to the server:', err);
  }
})();
