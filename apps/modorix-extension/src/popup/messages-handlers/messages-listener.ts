import { mapToXUser } from '@modorix-commons/gateways/block-user-gateway';
import { BlocksQueueUpdateData, isBlocksQueueUpdateMessage } from '../../shared/messages/event-message';

export function onRunBlocksQueueUpdateMessage(callback: (data: BlocksQueueUpdateData) => void) {
  chrome.runtime.onMessage.addListener((message) => {
    if (isBlocksQueueUpdateMessage(message)) {
      console.log('🚀 ~ chrome.runtime.onMessage.addListener ~ message:', message);
      callback({ blockQueue: message.data.blockQueue.map(mapToXUser), runQueueStatus: message.data.runQueueStatus });
    }
  });
}
