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

export interface UserBlockedMessageSuccessData {
  status: 'SUCCESS';
  userId: string;
  blockReasonIds: string[];
}

export interface UserBlockedMessageFailureData {
  status: 'FAILURE';
  message: `Couldn't block user ${string}`;
}

export type UserBlockedMessageData = UserBlockedMessageSuccessData | UserBlockedMessageFailureData;

type UserBlockedMessage = Message<UserBlockedMessageData>;

export function isBlockUserMessage(message: Message<unknown>): message is BlockUserMessage {
  return message.id === MessageIds.BLOCK_USER;
}

export function isUserBlockedMessage(message: Message<unknown>): message is UserBlockedMessage {
  return message.id === MessageIds.USER_BLOCKED;
}

export function isUserBlockedSuccessData(data: UserBlockedMessageData): data is UserBlockedMessageSuccessData {
  return data.status === 'SUCCESS';
}

export function isUserBlockedFailureData(data: UserBlockedMessageData): data is UserBlockedMessageFailureData {
  return data.status === 'FAILURE';
}
