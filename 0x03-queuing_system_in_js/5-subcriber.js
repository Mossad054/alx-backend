import { createClient } from 'redis';

async function subscriber() {
  const client = createClient();

  await client.connect();
  console.log('Redis connected to the server');

  await client.subscribe('holberton school channel', async (message) => {
    console.log(message);
    if (message === 'KILL_SERVER') {
      await client.unsubscribe();
      await client.quit();
    }
  });
}

subscriber();
