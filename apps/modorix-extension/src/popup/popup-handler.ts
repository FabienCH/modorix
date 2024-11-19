import { XUser } from '@modorix-commons/domain/models/x-user';
import { BlocksQueueUpdateData } from '../shared/messages/event-message';
import { onRunBlocksQueueUpdateMessage } from './messages-handlers/messages-listener';
import { sendRequestRunBlocksQueueMessage } from './messages-handlers/messages-sender';

export async function requestRunBlocksQueue(blockQueue: XUser[]) {
  await sendRequestRunBlocksQueueMessage(blockQueue);
}

export function onRunBlocksQueueUpdate(presenterNotifier: (state: BlocksQueueUpdateData) => void): void {
  onRunBlocksQueueUpdateMessage(presenterNotifier);
}
