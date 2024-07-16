import { MessageIds } from './message-ids.enum';

interface Message<Data> {
  id: string;
  data: Data;
}

export interface BlockUserMessageData {
  url: string;
  active: boolean;
  blockReasonIds: string[];
}

type BlockUserMessage = Message<BlockUserMessageData>;

export interface RequestBlockUserMessageData {
  xUsername: string;
  blockReasonIds: string[];
}

type RequestBlockUserMessage = Message<RequestBlockUserMessageData>;

export interface UserBlockedSuccessMessageData {
  status: 'SUCCESS';
  xUserId: number;
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

export function isUserBlockedSuccessData(data: UserBlockedMessageData): data is UserBlockedSuccessMessageData {
  return data.status === 'SUCCESS';
}

export function isUserBlockedFailureData(data: UserBlockedMessageData): data is UserBlockedFailureMessageData {
  return data.status === 'FAILURE';
}
