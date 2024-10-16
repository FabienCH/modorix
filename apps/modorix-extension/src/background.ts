import { setGatewayBaseUrl } from '@modorix-commons/gateways/base-url-config';
import { blockXUserInNewTab, handleBlockedUser, handleRequestBlockUser } from './background/block-x-user';
import {
  onBlockUserMessage,
  onRequestBlockUserMessage,
  onRequestRunBlocksQueueMessage,
  onUserBlockedMessage,
} from './background/infrastructure/messages-handlers/messages-listener';
import {
  sendBlockQueueUpdateMessage,
  sendNewXTabToListenLoadedMessage,
} from './background/infrastructure/messages-handlers/messages-sender';
import { runBlocksQueue } from './background/usecases/run-blocks-queue-usecase';
import { dependencies } from './dependencies';
import { BlocksQueueUpdateMessageData } from './shared/messages/event-message';

console.log('background loaded !');

setGatewayBaseUrl(import.meta.env.VITE_API_BASE_URL);

let blockUserTab: chrome.tabs.Tab | null = null;
const tabIdsListenedTo: number[] = [];

chrome.tabs.onUpdated.addListener(async (tabId: number, changes: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
  const isXTabLoaded = tab.url?.startsWith('https://x.com') && changes.status === 'complete';
  if (isXTabLoaded && tabId !== blockUserTab?.id && !tabIdsListenedTo.includes(tabId)) {
    tabIdsListenedTo.push(tabId);
    await sendNewXTabToListenLoadedMessage(tabId);
  }
});

onBlockUserMessage(async (data) => {
  blockUserTab = await blockXUserInNewTab(data);
});
onRequestBlockUserMessage(async (data) => await handleRequestBlockUser(data));
onRequestRunBlocksQueueMessage(async (data) => {
  const notify = (queueUpdateData: BlocksQueueUpdateMessageData) => {
    sendBlockQueueUpdateMessage(queueUpdateData);
  };
  await runBlocksQueue(data.blockQueue, notify, dependencies.userSessionStorage);
});
onUserBlockedMessage(async (data) => await handleBlockedUser(data));
