import { createClient } from 'redis';

async function publishMessage(message, time) {
  const client = createClient();

  await client.connect();
  console.log('Redis client connected to the server');

  setTimeout(async () => {
    console.log(`About to send ${message}`);
    await client.publish('holberton school channel', message);
  }, time);
}

publishMessage('Holberton Student #1 starts course', 100);
publishMessage('Holberton Student #2 starts course', 200);
publishMessage('KILL_SERVER', 300);
publishMessage('Holberton Student #3 starts course', 400);
