import { myQueue } from '../app.js';

const cronJobs = () => {
  myQueue.add('deleteExpiredItems', null, { repeat: { pattern: '0 0 * * *' } });
  myQueue.add('cleanExpiredOtp', null, { repeat: { pattern: '0 */5 * * *' } });
};

export default cronJobs;
