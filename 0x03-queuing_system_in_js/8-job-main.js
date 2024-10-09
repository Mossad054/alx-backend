export default function createPushNotificationsJobs(jobs, queue) {
  // Check if jobs is an array, if not throw an error
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  // Iterate over each job in the jobs array
  jobs.forEach((jobData) => {
    // Create a new job in the queue push_notification_code_3
    const job = queue.create('push_notification_code_3', jobData)
      .save((err) => {
        if (!err) {
          console.log(`Notification job created: ${job.id}`);
        }
      });

    // Log job completion
    job.on('complete', () => {
      console.log(`Notification job ${job.id} completed`);
    });

    // Log job failure with error
    job.on('failed', (err) => {
      console.log(`Notification job ${job.id} failed: ${err}`);
    });

    // Log job progress
    job.on('progress', (progress) => {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });
  });
}

