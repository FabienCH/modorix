import { saveBlockUser } from './background/block-user-gateway';
import {
  OpenTabMessageData,
  UserBlockedMessageData,
  isOpenTabMessage,
  isUserBlockedFailureData,
  isUserBlockedMessage,
  isUserBlockedSuccessData,
} from './core/event-message';
import { MessageIds } from './core/message-ids.enum';

console.log('background loaded !');

async function runBlockUser(tabId: number, changeInfo: chrome.tabs.TabChangeInfo) {
  if (tabId === blockUserTab?.id && changeInfo?.status === 'complete') {
    chrome.tabs.onUpdated.removeListener(runBlockUser);
    await chrome.scripting.executeScript({
      target: { tabId: blockUserTab.id },
      files: ['src/scripts/block-user.js'],
    });
  }
}

async function openNewTab(data: OpenTabMessageData) {
  blockUserTab = await chrome.tabs.create({
    url: data.url,
    active: data.active,
  });

  chrome.tabs.onUpdated.addListener(runBlockUser);
}

async function handleBlockedUser(data: UserBlockedMessageData) {
  if (isUserBlockedSuccessData(data)) {
    try {
      await saveBlockUser(data.userId);
    } catch (error) {
      console.error(`Modorix: Could not saved blocked user ${data.userId}`);
    }
  }
  if (isUserBlockedFailureData(data)) {
    console.warn(data.message);
  }

  terminateBlockUser(blockUserTab?.id);
}

function terminateBlockUser(tabId: number | undefined) {
  if (tabId) {
    chrome.tabs.remove(tabId);
  }
}

let blockUserTab: chrome.tabs.Tab | null = null;
let lastTabStatus: string = '';

chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
  if (changeInfo.status) {
    lastTabStatus = changeInfo.status;
  }

  if (lastTabStatus === 'complete' && tabId !== blockUserTab?.id) {
    lastTabStatus = '';
    chrome.tabs.sendMessage(tabId, {
      id: MessageIds.PAGE_TO_LISTEN_LOADED,
    });
  }
});

chrome.runtime.onMessage.addListener(async (message) => {
  if (isOpenTabMessage(message)) {
    await openNewTab(message.data);
  }

  if (isUserBlockedMessage(message)) {
    await handleBlockedUser(message.data);
  }
});
