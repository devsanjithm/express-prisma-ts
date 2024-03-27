import cron from 'node-cron';
import deleteExpiredItems from './softDelete.service';

const cronJobs = () => {
  const task = cron.schedule('0 0 * * *', () => {
    deleteExpiredItems();
  });

  task.start();
};

export default cronJobs;
