import { GatewayXUser } from '@modorix-commons/gateways/gateway-x-user';

let blocksQueue: GatewayXUser[] = [];

export function setBlockQueue(value: GatewayXUser[]): void {
  blocksQueue = [...value];
}

export function getBLockQueue(): GatewayXUser[] {
  return blocksQueue;
}

export function removeBlockQueueItem(xUser: GatewayXUser): void {
  blocksQueue = blocksQueue.filter((xu) => xu.xId !== xUser.xId);
}
