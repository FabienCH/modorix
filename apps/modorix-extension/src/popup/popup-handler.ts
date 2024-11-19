import { XUser } from '@modorix-commons/domain/models/x-user';
import { RunQueueStatus } from '../shared/messages/event-message';
import { onBlocksQueueStatusUpdateMessage, onRunBlocksQueueUpdateMessage } from './messages-handlers/messages-listener';
import { sendGetRunBlocksQueueStatusMessage, sendRequestRunBlocksQueueMessage } from './messages-handlers/messages-sender';

export async function requestRunBlocksQueue(blockQueue: XUser[]) {
  await sendRequestRunBlocksQueueMessage(
    blockQueue.map((xUser) => ({
      ...xUser,
      blockEvents: xUser.blockEvents.map((event) => ({ ...event, blockedAt: event.blockedAt.toISOString() })),
    })),
  );
}

export async function requestBlocksQueueStatus() {
  await sendGetRunBlocksQueueStatusMessage();
}

export function onRunBlocksQueueUpdate(presenterNotifier: (state: { runQueueStatus: RunQueueStatus; blockQueue: XUser[] }) => void): void {
  onRunBlocksQueueUpdateMessage(presenterNotifier);
}

export function onBlocksQueueStatusUpdate(presenterNotifier: (state: { runQueueStatus: RunQueueStatus }) => void): void {
  onBlocksQueueStatusUpdateMessage(presenterNotifier);
}
