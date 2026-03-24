import redis from '../config/redis.js';
import { bullBoardRouter } from './bull-board.js';
import { closeSessionStatusCron, setupSessionStatusCron } from './crons/session-status.cron.js';

const cronJobs = [
  {
    name: 'session-status',
    setup: setupSessionStatusCron,
    close: closeSessionStatusCron
  }
];

export { bullBoardRouter };

export const setupJobs = async () => {
  for (const job of cronJobs) {
    try {
      await job.setup();
    } catch (error) {
      console.error(`Failed to set up ${job.name} job:`, error.message);
      throw error;
    }
  }
};

export const closeJobs = async () => {
  for (const job of [...cronJobs].reverse()) {
    try {
      await job.close();
    } catch (error) {
      console.error(`Failed to close ${job.name} job:`, error.message);
    }
  }

  try {
    await redis.quit();
  } catch (error) {
    console.error('Failed to close Redis connection:', error.message);
  }
};
