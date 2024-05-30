console.log('The extension is up and running');

import { listenForUsernamesMouseEnter, updateUsernamesListener } from './content/content-handler';
import { MessageIds } from './core/message-ids.enum';

let userNameLinksElements: HTMLElement[];

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.id === MessageIds.PAGE_TO_LISTEN_LOADED) {
    updateUsernamesListener(userNameLinksElements);
  }
});

(async () => {
  userNameLinksElements = await listenForUsernamesMouseEnter();
  document.addEventListener('scrollend', updateUsernamesListener.bind(this, userNameLinksElements));
})();
