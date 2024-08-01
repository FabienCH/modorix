console.log('The extension is up and running');

import { setGatewayBaseUrl } from '@modorix-commons/gateways/base-url-config';
import { onRequestRunBlocksQueueMessage, onTabToListenLoadedMessage } from './content/infrastructure/messages-handlers/messages-listener';
import { listenForUsernamesMouseEnter, updateUsernamesMouseEnterListener } from './content/usernames-mouse-enter-listener';
import { SetHeadersMessageData } from './shared/messages/event-message';
import { MessageIds } from './shared/messages/message-ids.enum';

function injectRequestListenerScript() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('src/content/scripts/x-request-listener.js');
  script.onload = function () {
    script.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}

setGatewayBaseUrl(import.meta.env.VITE_API_BASE_URL);
onTabToListenLoadedMessage(updateUsernamesMouseEnterListener);

onRequestRunBlocksQueueMessage(() => {
  injectRequestListenerScript();
  document.addEventListener(
    MessageIds.SET_HEADERS,
    async (event) => {
      const data: SetHeadersMessageData = event.detail;
      await chrome.runtime.sendMessage('', {
        id: MessageIds.SET_HEADERS,
        data,
      });
    },
    { once: true },
  );
});

(async () => {
  await listenForUsernamesMouseEnter();
  document.addEventListener('scrollend', updateUsernamesMouseEnterListener);
})();
