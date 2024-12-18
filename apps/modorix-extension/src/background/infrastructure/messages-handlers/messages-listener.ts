import {
  BlockUserMessageData,
  RequestBlockUserMessageData,
  RequestRunBlocksQueueMessageData,
  SetHeadersMessageData,
  UserBlockedMessageData,
  isBlockUserMessage,
  isGetBlocksQueueStatusMessage,
  isRequestBlockUserMessage,
  isRequestRunBlocksQueueMessage,
  isSetHeadersMessage,
  isUserBlockedMessage,
} from '../../../shared/messages/event-message';

export function onBlockUserMessage(callback: (data: BlockUserMessageData) => Promise<void>) {
  chrome.runtime.onMessage.addListener(async (message) => {
    if (isBlockUserMessage(message)) {
      await callback(message.data);
    }
  });
}

export function onRequestBlockUserMessage(callback: (data: RequestBlockUserMessageData) => Promise<void>) {
  chrome.runtime.onMessage.addListener(async (message) => {
    if (isRequestBlockUserMessage(message)) {
      await callback(message.data);
    }
  });
}

export function onUserBlockedMessage(callback: (data: UserBlockedMessageData) => Promise<void>) {
  chrome.runtime.onMessage.addListener(async (message) => {
    if (isUserBlockedMessage(message)) {
      await callback(message.data);
    }
  });
}

export function onRequestRunBlocksQueueMessage(callback: (data: RequestRunBlocksQueueMessageData) => Promise<void>) {
  chrome.runtime.onMessage.addListener(async (message) => {
    if (isRequestRunBlocksQueueMessage(message)) {
      await callback(message.data);
    }
  });
}

export function onGetRunBlocksQueueStatusMessage(callback: () => Promise<void>) {
  chrome.runtime.onMessage.addListener(async (message) => {
    if (isGetBlocksQueueStatusMessage(message)) {
      await callback();
    }
  });
}

export function onSetHeadersMessage(callback: (data: SetHeadersMessageData) => void) {
  chrome.runtime.onMessage.addListener(async (message) => {
    if (isSetHeadersMessage(message)) {
      await callback(message.data);
    }
  });
}
