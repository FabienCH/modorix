import {
  BlockUserMessageData,
  RequestBlockUserMessageData,
  UserBlockedMessageData,
  isUserBlockedFailureData,
  isUserBlockedSuccessData,
} from '../shared/messages/event-message';
import { saveBlockUser } from './infrastructure/gateways/block-user-gateway';

let blockUserTab: chrome.tabs.Tab | null = null;
let requestBlockUserMessageData: RequestBlockUserMessageData | null = null;

export async function blockXUserInNewTab(data: BlockUserMessageData): Promise<chrome.tabs.Tab> {
  blockUserTab = await chrome.tabs.create({
    url: data.url,
    active: data.active,
  });
  chrome.storage.local.set({ blockReasonIds: JSON.stringify(data.blockReasonIds) });
  chrome.tabs.onUpdated.addListener(runBlockUser);
  return blockUserTab;
}

export async function handleRequestBlockedUser(data: RequestBlockUserMessageData) {
  requestBlockUserMessageData = data;
}

export async function handleBlockedUser(data: UserBlockedMessageData): Promise<void> {
  if (isUserBlockedSuccessData(data) && requestBlockUserMessageData?.xUsername === data.xUsername) {
    try {
      await saveBlockUser(data.xUserId, data.xUsername, requestBlockUserMessageData.blockReasonIds);
    } catch (error) {
      console.error(`Modorix: Could not saved blocked user ${data.xUsername}`);
    }
  }
  if (isUserBlockedFailureData(data)) {
    console.warn(data.message);
  }

  terminateBlockUser(blockUserTab?.id);
}

async function runBlockUser(tabId: number, changeInfo: chrome.tabs.TabChangeInfo) {
  if (tabId === blockUserTab?.id && changeInfo?.status === 'complete') {
    chrome.tabs.onUpdated.removeListener(runBlockUser);
    await chrome.scripting.executeScript({
      target: { tabId: blockUserTab.id },
      files: ['src/content/scripts/block-user.js'],
    });
  }
}

function terminateBlockUser(tabId: number | undefined) {
  if (tabId) {
    chrome.tabs.remove(tabId);
  }
}
