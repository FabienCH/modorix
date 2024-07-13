import { BlockUserMessageData, UserBlockedMessageFailureData, UserBlockedMessageSuccessData } from '../../../shared/messages/event-message';
import { MessageIds } from '../../../shared/messages/message-ids.enum';

export function sendXUserBlockedSuccess(userName: string, blockReasonIds: string[]): Promise<void> {
  const data: UserBlockedMessageSuccessData = { status: 'SUCCESS', userId: userName, blockReasonIds };
  return chrome.runtime.sendMessage('', {
    id: MessageIds.USER_BLOCKED,
    data,
  });
}

export function sendXUserBlockedFailure(userName: string): Promise<void> {
  const data: UserBlockedMessageFailureData = {
    status: 'FAILURE',
    message: `Couldn't block user ${userName}`,
  };
  return chrome.runtime.sendMessage('', {
    id: MessageIds.USER_BLOCKED,
    data,
  });
}

export function sendBlockXUser(url: string, blockReasonIds: string[]): Promise<void> {
  const data: BlockUserMessageData = {
    url,
    active: true,
    blockReasonIds,
  };
  return chrome.runtime.sendMessage('', {
    id: MessageIds.BLOCK_USER,
    data,
  });
}
