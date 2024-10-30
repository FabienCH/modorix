import { XUser } from '@modorix-commons/domain/models/x-user';
import { MessageIds } from './message-ids.enum';

interface Message<Data> {
  id: string;
  data: Data;
}

export interface BlockUserMessageData {
  url: string;
  active: boolean;
  blockReasonIds: string[];
  groupIds: string[];
}

type BlockUserMessage = Message<BlockUserMessageData>;

export interface RequestBlockUserMessageData {
  xUsername: string;
  blockReasonIds: string[];
  groupIds: string[];
}

type RequestBlockUserMessage = Message<RequestBlockUserMessageData>;

export interface RequestRunBlocksQueueMessageData {
  blockQueue: XUser[];
}

type RequestRunBlocksQueueMessage = Message<RequestRunBlocksQueueMessageData>;

export interface SetHeadersMessageData {
  requestHeaders: Record<string, string>;
}

type SetHeadersMessage = Message<SetHeadersMessageData>;

export type RunQueueStatus = 'ready' | 'error' | 'waitingHeaders' | 'running';

export interface BlocksQueueUpdateMessageData {
  runQueueStatus: RunQueueStatus;
  blockQueue: XUser[];
}

type BlocksQueueUpdateMessage = Message<BlocksQueueUpdateMessageData>;

export interface UserBlockedSuccessMessageData {
  status: 'SUCCESS';
  xUserId: string;
  xUsername: string;
}

export interface UserBlockedFailureMessageData {
  status: 'FAILURE';
  message: `Couldn't block user ${string}`;
}

export type UserBlockedMessageData = UserBlockedSuccessMessageData | UserBlockedFailureMessageData;

type UserBlockedMessage = Message<UserBlockedMessageData>;

export function isBlockUserMessage(message: Message<unknown>): message is BlockUserMessage {
  return message.id === MessageIds.BLOCK_USER;
}

export function isRequestBlockUserMessage(message: Message<unknown>): message is RequestBlockUserMessage {
  return message.id === MessageIds.REQUEST_BLOCK_USER;
}

export function isUserBlockedMessage(message: Message<unknown>): message is UserBlockedMessage {
  return message.id === MessageIds.USER_BLOCKED;
}

export function isRequestRunBlocksQueueMessage(message: Message<unknown>): message is RequestRunBlocksQueueMessage {
  return message.id === MessageIds.REQUEST_RUN_BLOCKS_QUEUE;
}

export function isSetHeadersMessage(message: Message<unknown>): message is SetHeadersMessage {
  return message.id === MessageIds.SET_HEADERS;
}

export function isBlocksQueueUpdateMessage(message: Message<unknown>): message is BlocksQueueUpdateMessage {
  return message.id === MessageIds.BLOCKS_QUEUE_UPDATE;
}

export function isUserBlockedSuccessData(data: UserBlockedMessageData): data is UserBlockedSuccessMessageData {
  return data.status === 'SUCCESS';
}

export function isUserBlockedFailureData(data: UserBlockedMessageData): data is UserBlockedFailureMessageData {
  return data.status === 'FAILURE';
}
