import { Worker } from 'bullmq';
import redis from '../../config/redis.js';
import { refreshSessionStatuses } from '../../services/session.service.js';
import { sessionStatusQueue } from '../queues/session-status.queue.js';

const REPEAT_JOB_NAME = 'refresh-session-statuses';
const CRON_EXPRESSION = process.env.SESSION_STATUS_CRON || '* * * * *';

let sessionStatusWorker;

export const setupSessionStatusCron = async () => {
  try {
    if (!sessionStatusWorker) {
      sessionStatusWorker = new Worker(
        sessionStatusQueue.name,
        async () => {
          try {
            await refreshSessionStatuses();
            return { refreshedAt: new Date().toISOString() };
          } catch (error) {
            console.error('Unable to refresh session statuses:', error.message);
            throw error;
          }
        },
        {
          connection: redis
        }
      );

      sessionStatusWorker.on('failed', (job, error) => {
        console.error(`Session status job failed (${job?.id || 'unknown'}):`, error.message);
      });

      sessionStatusWorker.on('error', (error) => {
        console.error('Session status worker error:', error.message);
      });
    }

    await sessionStatusQueue.waitUntilReady();
    await sessionStatusWorker.waitUntilReady();

    await sessionStatusQueue.add(
      REPEAT_JOB_NAME,
      {},
      {
        jobId: REPEAT_JOB_NAME,
        repeat: {
          pattern: CRON_EXPRESSION
        }
      }
    );
  } catch (error) {
    console.error('Failed to set up session status cron:', error.message);
    throw error;
  }
};

export const closeSessionStatusCron = async () => {
  try {
    if (sessionStatusWorker) {
      await sessionStatusWorker.close();
      sessionStatusWorker = null;
    }
  } catch (error) {
    console.error('Failed to close session status worker:', error.message);
  }

  try {
    await sessionStatusQueue.close();
  } catch (error) {
    console.error('Failed to close session status queue:', error.message);
  }
};
