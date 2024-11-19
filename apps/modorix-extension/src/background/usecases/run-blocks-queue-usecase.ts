import { GatewayXUser } from '@modorix-commons/gateways/gateway-x-user';
import { UserSessionStorage } from '@modorix/commons';
import { BlocksQueueUpdateMessageData } from '../../shared/messages/event-message';
import { getBlockQueue, removeBlockQueueItem, setBlockQueue } from '../domain/blocks-queue';
import { updateBlockedUser } from '../infrastructure/gateways/block-user-gateway';
import { blockUserOnX } from '../infrastructure/gateways/x-gateway';
import { waitForXHeaders } from '../wait-for-x-headers';

export async function runBlocksQueue(
  blockQueue: GatewayXUser[],
  notifyView: (state: BlocksQueueUpdateMessageData) => void,
  userSessionStorage: UserSessionStorage,
): Promise<void | Error> {
  notifyView({ runQueueStatus: 'waitingHeaders', blockQueue });
  const baseDelay = 5000;
  const timeout = 3 * 60 * 1000;
  const headers = await waitForXHeaders(timeout);
  if (!headers) {
    notifyView({ runQueueStatus: 'error', blockQueue });
    return new Error(`Couldn't get headers from X within the last ${timeout / 1000} seconds`);
  }
  setBlockQueue(blockQueue);
  for (const [index, xUser] of blockQueue.entries()) {
    const delay = getDelay(baseDelay, index);
    const response = await delayRequests(() => blockXUser(xUser.xId, headers, userSessionStorage), delay);
    if (response.status === 403 || response.status === 401) {
      notifyView({ runQueueStatus: 'error', blockQueue });
      return new Error(`${response.status}`);
    }
    removeBlockQueueItem(xUser);
    const newBlockQueue = getBlockQueue();
    notifyView({ runQueueStatus: newBlockQueue.length ? 'running' : 'ready', blockQueue: newBlockQueue });
  }
}

function getDelay(baseDelay: number, index: number): number {
  if (index === 0) {
    return 0;
  }
  return baseDelay + Math.round(Math.random() * 3000);
}

async function blockXUser(xUserId: string, headers: Record<string, string>, userSessionStorage: UserSessionStorage): Promise<Response> {
  const blockUserOnXRes = await blockUserOnX(xUserId, headers);
  if (blockUserOnXRes.status === 403 || blockUserOnXRes.status === 401) {
    return blockUserOnXRes;
  }
  return updateBlockedUser(xUserId, userSessionStorage);
}

function delayRequests(requestCallback: () => Promise<Response>, delay: number): Promise<Response> {
  return new Promise((resolve) => {
    setTimeout(async () => {
      resolve(await requestCallback());
    }, delay);
  });
}
