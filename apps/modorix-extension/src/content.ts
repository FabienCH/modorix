console.log('The extension is up and running');

import { onTabToListenLoadedMessage } from './content/infrastructure/messages-handlers/messages-listener';
import { listenForUsernamesMouseEnter, updateUsernamesMouseEnterListener } from './content/usernames-mouse-enter-listener';

onTabToListenLoadedMessage(updateUsernamesMouseEnterListener);

(async () => {
  await listenForUsernamesMouseEnter();
  document.addEventListener('scrollend', updateUsernamesMouseEnterListener);
})();
