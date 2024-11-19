import { GatewayXUser } from '@modorix-commons/gateways/gateway-x-user';
import { RequestRunBlocksQueueMessageData } from '../../shared/messages/event-message';
import { MessageIds } from '../../shared/messages/message-ids.enum';

export async function sendRequestRunBlocksQueueMessage(blockQueue: GatewayXUser[]): Promise<void> {
  const data: RequestRunBlocksQueueMessageData = { blockQueue };
  const xTab = await chrome.tabs.query({ url: 'https://x.com/*' });
  await chrome.tabs.sendMessage(xTab[0].id ?? 0, {
    id: MessageIds.REQUEST_RUN_BLOCKS_QUEUE,
    data,
  });
  await chrome.runtime.sendMessage('', {
    id: MessageIds.REQUEST_RUN_BLOCKS_QUEUE,
    data,
  });
}

export async function sendGetRunBlocksQueueStatusMessage(): Promise<void> {
  await chrome.runtime.sendMessage('', {
    id: MessageIds.GET_BLOCKS_QUEUE_STATUS,
  });
}
