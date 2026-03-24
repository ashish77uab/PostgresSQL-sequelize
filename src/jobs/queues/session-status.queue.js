import { Queue } from 'bullmq';
import redis from '../../config/redis.js';
import { registerBullBoardQueue } from '../bull-board.js';

const QUEUE_NAME = 'session-status';

export const sessionStatusQueue = new Queue(QUEUE_NAME, {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 25,
    removeOnFail: 50
  }
});

registerBullBoardQueue(sessionStatusQueue);
