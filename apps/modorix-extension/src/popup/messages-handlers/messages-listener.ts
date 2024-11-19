import { mapToXUser } from '@modorix-commons/gateways/block-user-gateway';
import { XUser } from '../../../../../packages/modorix-commons/src/domain/models/x-user';
import { isBlocksQueueStatusUpdateMessage, isBlocksQueueUpdateMessage, RunQueueStatus } from '../../shared/messages/event-message';

export function onRunBlocksQueueUpdateMessage(callback: (data: { runQueueStatus: RunQueueStatus; blockQueue: XUser[] }) => void) {
  chrome.runtime.onMessage.addListener((message) => {
    if (isBlocksQueueUpdateMessage(message)) {
      callback({ blockQueue: message.data.blockQueue.map(mapToXUser), runQueueStatus: message.data.runQueueStatus });
    }
  });
}

export function onBlocksQueueStatusUpdateMessage(callback: (data: { runQueueStatus: RunQueueStatus }) => void) {
  chrome.runtime.onMessage.addListener((message) => {
    if (isBlocksQueueStatusUpdateMessage(message)) {
      callback(message.data);
    }
  });
}
