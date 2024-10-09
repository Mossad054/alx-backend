import kue from 'kue';

// Create Kue queue
const queue = kue.createQueue();

// Function to send notification
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// Process jobs in the queue
queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;
  
  // Call the sendNotification function
  sendNotification(phoneNumber, message);
  
  // Finish the job
  done();
});

