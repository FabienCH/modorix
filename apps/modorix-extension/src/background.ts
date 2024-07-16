import { blockXUserInNewTab, handleBlockedUser, handleRequestBlockedUser } from './background/block-x-user';
import {
  onBlockUserMessage,
  onRequestBlockUserMessage,
  onUserBlockedMessage,
} from './background/infrastructure/messages-handlers/messages-listener';
import { sendNewXTabToListenLoadedMessage } from './background/infrastructure/messages-handlers/messages-sender';

console.log('background loaded !');

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
onRequestBlockUserMessage(async (data) => await handleRequestBlockedUser(data));
onUserBlockedMessage(async (data) => await handleBlockedUser(data));
