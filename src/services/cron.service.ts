import cron from 'node-cron';
import deleteExpiredItems from './softDelete.service.js';
import * as otpService from './otp.service.js';

const cronJobs = () => {
  const deleteSoftDeletedItems = cron.schedule('0 0 * * *', () => {
    deleteExpiredItems();
  });

  const deleteExpiredOtp = cron.schedule('0 */5 * * *', () => {
    otpService.cleanExpiredOtp();
  });

  deleteSoftDeletedItems.start();
  deleteExpiredOtp.start();
};

export default cronJobs;
