import { GatewayXUser } from '@modorix-commons/gateways/gateway-x-user';
import { RequestRunBlocksQueueMessageData } from '../../shared/messages/event-message';
import { MessageIds } from '../../shared/messages/message-ids.enum';

export async function sendRequestRunBlocksQueueMessage(blockQueue: GatewayXUser[]): Promise<void> {
  const existingXTabs = await chrome.tabs.query({ url: 'https://x.com/*' });
  const xTab = existingXTabs?.length ? existingXTabs[0] : await chrome.tabs.create({ url: 'https://x.com' });
  if (xTab.id) {
    if (!xTab.active) {
      chrome.tabs.update(xTab.id, { active: true });
    }
    const data: RequestRunBlocksQueueMessageData = { blockQueue, xTabId: xTab.id };
    await chrome.runtime.sendMessage(null, {
      id: MessageIds.REQUEST_RUN_BLOCKS_QUEUE,
      data,
    });
  }
}

export async function sendGetRunBlocksQueueStatusMessage(): Promise<void> {
  await chrome.runtime.sendMessage(null, {
    id: MessageIds.GET_BLOCKS_QUEUE_STATUS,
  });
}
