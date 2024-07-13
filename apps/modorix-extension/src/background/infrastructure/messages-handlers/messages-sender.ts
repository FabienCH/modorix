import { MessageIds } from '../../../shared/messages/message-ids.enum';

export function sendNewTabToListenLoaded(tabId: number): Promise<void> {
  return chrome.tabs.sendMessage(tabId, {
    id: MessageIds.TAB_TO_LISTEN_LOADED,
  });
}
