import { MessageIds } from './core/message-ids.enum';

console.log('background loaded !');

let blockUserTab: chrome.tabs.Tab | null = null;

function terminateBlockUser(tabId: number | undefined) {
  if (tabId) {
    chrome.tabs.remove(tabId);
  }
}

async function runBlockUser(tabId: number, changeInfo: chrome.tabs.TabChangeInfo) {
  if (tabId === blockUserTab?.id && changeInfo?.status === 'complete') {
    chrome.tabs.onUpdated.removeListener(runBlockUser);
    await chrome.scripting.executeScript({
      target: { tabId: blockUserTab.id },
      files: ['src/scripts/block-user.js'],
    });
  }
}

async function openNewTab(request: any) {
  blockUserTab = await chrome.tabs.create({
    url: request.data.url,
    active: request.data.active,
  });

  chrome.tabs.onUpdated.addListener(runBlockUser);
}

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

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.id === MessageIds.OPEN_TAB) {
    await openNewTab(request);
  }

  if (request.id === MessageIds.USER_BLOCKED) {
    if (request.data.status === 'FAILURE') {
      console.warn(request.data.message);
    }
    if (request.data.status === 'SUCCESS') {
      try {
        await fetch('http://localhost:3000/api/block-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: request.data.userId,
            blockedAt: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error(`Modorix: Could not saved blocked user ${request.data.userId}`);
      }
    }

    terminateBlockUser(blockUserTab?.id);
  }
});
