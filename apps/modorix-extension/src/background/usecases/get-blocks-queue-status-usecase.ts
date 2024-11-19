import { BlocksQueueStatusUpdateMessageData } from '../../shared/messages/event-message';
import { getBLockQueue as getBlockQueue } from '../domain/blocks-queue';

export function getBlocksQueueStatus(notifyView: (state: BlocksQueueStatusUpdateMessageData) => void): void {
  const blockQueue = getBlockQueue();
  notifyView({ runQueueStatus: blockQueue.length ? 'running' : 'ready' });
}
