import { BlocksQueueStatusUpdateMessageData, BlocksQueueUpdateMessageData } from '../../../shared/messages/event-message';
import { MessageIds } from '../../../shared/messages/message-ids.enum';

export function sendNewXTabToListenLoadedMessage(tabId: number): Promise<void> {
  return chrome.tabs.sendMessage(tabId, {
    id: MessageIds.TAB_TO_LISTEN_LOADED,
  });
}

export function sendBlockQueueUpdateMessage(data: BlocksQueueUpdateMessageData): Promise<void> {
  return chrome.runtime.sendMessage('', { id: MessageIds.BLOCKS_QUEUE_UPDATE, data });
}

export function sendBlockQueueStatusUpdateMessage(data: BlocksQueueStatusUpdateMessageData): Promise<void> {
  return chrome.runtime.sendMessage('', { id: MessageIds.BLOCKS_QUEUE_STATUS_UPDATE, data });
}
