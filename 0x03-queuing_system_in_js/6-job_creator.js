import kue from 'kue';

const job_data = {
  phoneNumber: '0002000',
  message: 'job creator test',
};

const queue = kue.createQueue();
const job = queue.create('push_notification_code', job_data).save((err) => {
  console.log(`Notification job created: ${job.id}`);
});

job
  .on('complete', () => {
    console.log('Notification job completed');
  })
  .on('failed', () => {
    console.log('Notification job failed');
  });
