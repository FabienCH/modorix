import {
  BlockUserMessageData,
  RequestBlockUserMessageData,
  UserBlockedMessageData,
  isBlockUserMessage,
  isRequestBlockUserMessage,
  isUserBlockedMessage,
} from '../../../shared/messages/event-message';

export function onBlockUserMessage(callback: (data: BlockUserMessageData) => Promise<void>) {
  chrome.runtime.onMessage.addListener(async (message) => {
    if (isBlockUserMessage(message)) {
      callback(message.data);
    }
  });
}

export function onRequestBlockUserMessage(callback: (data: RequestBlockUserMessageData) => Promise<void>) {
  chrome.runtime.onMessage.addListener(async (message) => {
    if (isRequestBlockUserMessage(message)) {
      callback(message.data);
    }
  });
}

export function onUserBlockedMessage(callback: (data: UserBlockedMessageData) => Promise<void>) {
  chrome.runtime.onMessage.addListener(async (message) => {
    if (isUserBlockedMessage(message)) {
      callback(message.data);
    }
  });
}
