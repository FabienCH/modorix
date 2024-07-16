import { MessageIds } from '../../../shared/messages/message-ids.enum';

export function onTabToListenLoadedMessage(callback: () => void) {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.id === MessageIds.TAB_TO_LISTEN_LOADED) {
      callback();
    }
  });
}
