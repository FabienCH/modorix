import { blockInNewTab, handleBlockedUser } from './background/block-x-user';
import { onBlockUserMessage, onUserBlockedMessage } from './background/infrastructure/messages-handler/messages-listener';
import { sendNewTabToListenLoaded } from './background/infrastructure/messages-handler/messages-sender';

console.log('background loaded !');

let blockUserTab: chrome.tabs.Tab | null = null;

chrome.tabs.onUpdated.addListener(async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
  let lastTabStatus = changeInfo.status;

  if (lastTabStatus === 'complete' && tabId !== blockUserTab?.id) {
    lastTabStatus = '';
    await sendNewTabToListenLoaded(tabId);
  }
});

onBlockUserMessage(async (data) => {
  blockUserTab = await blockInNewTab(data);
});
onUserBlockedMessage(async (data) => await handleBlockedUser(data));
