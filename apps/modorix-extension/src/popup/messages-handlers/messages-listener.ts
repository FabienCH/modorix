import { BlocksQueueUpdateMessageData, isBlocksQueueUpdateMessage } from '../../shared/messages/event-message';

export function onRunBlocksQueueUpdateMessage(callback: (data: BlocksQueueUpdateMessageData) => void) {
  chrome.runtime.onMessage.addListener((message) => {
    if (isBlocksQueueUpdateMessage(message)) {
      callback(message.data);
    }
  });
}
