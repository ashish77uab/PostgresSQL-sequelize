import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

const { addQueue } = createBullBoard({
  queues: [],
  serverAdapter
});

export const registerBullBoardQueue = (queue) => {
  addQueue(new BullMQAdapter(queue));
};

export const bullBoardRouter = serverAdapter.getRouter();
