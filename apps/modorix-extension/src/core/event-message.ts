import { MessageIds } from './message-ids.enum';

interface Message<Data> {
  id: string;
  data: Data;
}

export interface OpenTabMessageData {
  url: string;
  active: boolean;
}

type OpenTabMessage = Message<OpenTabMessageData>;

export interface UserBlockedMessageSuccessData {
  status: 'SUCCESS';
  userId: string;
}

export interface UserBlockedMessageFailureData {
  status: 'FAILURE';
  message: `Couldn't block user ${string}`;
}

export type UserBlockedMessageData = UserBlockedMessageSuccessData | UserBlockedMessageFailureData;

type UserBlockedMessage = Message<UserBlockedMessageData>;

export function isOpenTabMessage(message: Message<unknown>): message is OpenTabMessage {
  return message.id === MessageIds.OPEN_TAB;
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
