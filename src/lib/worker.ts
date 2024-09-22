import { Job, Worker } from 'bullmq';
import config from '../config/config.js';
import deleteExpiredItems from '../services/softDelete.service.js';
import { cleanExpiredOtp } from '../services/otp.service.js';

const jobHandlers: any = {
  deleteExpiredItems,
  cleanExpiredOtp
};
export const startWorker = () => {
  const processJob = async (job: Job) => {
    const handler = jobHandlers[job.name];

    if (handler) {
      console.log(`Processing job: ${job.name}`);
      await handler(job);
    }
  };

  const myWorker = new Worker('myQueue', processJob, {
    connection: { url: config.redis.url },
    useWorkerThreads: true,
    concurrency: 10
  });

  myWorker.on('completed', (job) => {
    console.log(`${job.id} has completed!`);
  });

  myWorker.on('failed', (job: any, err: any) => {
    console.log(`${job.id} has failed with ${err.message}`);
  });

  console.log('Worker started!');
};
