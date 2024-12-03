import { BlockUserMessageData, RequestBlockUserMessageData, UserBlockedFailureMessageData } from '../../../shared/messages/event-message';
import { MessageIds } from '../../../shared/messages/message-ids.enum';

export function sendRequestBlockXUserMessage(xUsername: string, blockReasonIds: string[], groupIds: string[]): Promise<void> {
  const data: RequestBlockUserMessageData = { xUsername: xUsername.replace('@', ''), blockReasonIds, groupIds };
  return chrome.runtime.sendMessage(null, {
    id: MessageIds.REQUEST_BLOCK_USER,
    data,
  });
}

export function sendXUserBlockedSuccessMessage(event: UserBlockedSuccessEvent): Promise<void> {
  return chrome.runtime.sendMessage(null, {
    id: MessageIds.USER_BLOCKED,
    data: event.detail,
  });
}

export function sendXUserBlockedFailureMessage(userName: string): Promise<void> {
  const data: UserBlockedFailureMessageData = {
    status: 'FAILURE',
    message: `Couldn't block user ${userName}`,
  };
  return chrome.runtime.sendMessage(null, {
    id: MessageIds.USER_BLOCKED,
    data,
  });
}

export function sendBlockXUserMessage(url: string, blockReasonIds: string[], groupIds: string[]): Promise<void> {
  const data: BlockUserMessageData = {
    url,
    active: true,
    blockReasonIds,
    groupIds,
  };
  return chrome.runtime.sendMessage(null, {
    id: MessageIds.BLOCK_USER,
    data,
  });
}
