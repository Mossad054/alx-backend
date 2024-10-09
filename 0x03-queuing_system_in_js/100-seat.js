import express from 'express';
import redis from 'redis';
import { promisify } from 'util';
import kue from 'kue';

// Create an Express app
const app = express();

// Create a Redis client
const client = redis.createClient();

// Promisify Redis functions
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Kue Queue
const queue = kue.createQueue();

// Initialize seats and reservation status
let reservationEnabled = true;
const INITIAL_SEATS = 50;

// Function to reserve seats
const reserveSeat = async (number) => {
  await setAsync('available_seats', number);
};

// Function to get the current available seats
const getCurrentAvailableSeats = async () => {
  const seats = await getAsync('available_seats');
  return seats ? parseInt(seats) : 0;
};

// Initialize available seats to 50 when server starts
reserveSeat(INITIAL_SEATS);

// Route to get the number of available seats
app.get('/available_seats', async (req, res) => {
  const seats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: seats });
});

// Route to reserve a seat
app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservation are blocked' });
  }

  const job = queue.create('reserve_seat').save((err) => {
    if (err) {
      return res.json({ status: 'Reservation failed' });
    }
    res.json({ status: 'Reservation in process' });
  });

  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  job.on('failed', (errorMessage) => {
    console.log(`Seat reservation job ${job.id} failed: ${errorMessage}`);
  });
});

// Route to process the reservation queue
app.get('/process', (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    const availableSeats = await getCurrentAvailableSeats();
    
    if (availableSeats <= 0) {
      reservationEnabled = false;
      return done(new Error('Not enough seats available'));
    }

    const newAvailableSeats = availableSeats - 1;
    await reserveSeat(newAvailableSeats);

    if (newAvailableSeats === 0) {
      reservationEnabled = false;
    }

    done();
  });
});

// Server listening on port 1245
const PORT = 1245;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

