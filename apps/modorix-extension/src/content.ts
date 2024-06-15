console.log('The extension is up and running');

import { listenForUsernamesMouseEnter, updateUsernamesListener } from './content/content-handler';
import { MessageIds } from './core/message-ids.enum';

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.id === MessageIds.PAGE_TO_LISTEN_LOADED) {
    updateUsernamesListener();
  }
});

(async () => {
  await listenForUsernamesMouseEnter();
  document.addEventListener('scrollend', updateUsernamesListener);
})();
