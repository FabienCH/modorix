/// <reference types="vite/client" />
import { MessageIds } from '../../shared/messages/message-ids.enum';

const userBlocked = MessageIds.USER_BLOCKED;
const setHeaders = MessageIds.SET_HEADERS;

declare global {
  interface CustomEventMap extends DocumentEventMap {
    userBlocked: UserBlockedSuccessEvent;
    setHeaders: SetHeadersEvent;
  }

  class UserBlockedSuccessEvent extends Event implements CustomEvent {
    initCustomEvent(
      type: string,
      bubbles?: boolean | undefined,
      cancelable?: boolean | undefined,
      detail: UserBlockedSuccessMessageData,
    ): void;
    detail: UserBlockedSuccessMessageData;
  }

  class SetHeadersEvent extends Event implements CustomEvent {
    initCustomEvent(type: string, bubbles?: boolean | undefined, cancelable?: boolean | undefined, detail: SetHeadersMessageData): void;
    detail: SetHeadersMessageData;
  }

  interface Document {
    addEventListener<K extends keyof CustomEventMap>(type: K, listener: (this: Document, ev: CustomEventMap[K]) => void): void;
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      listener: (this: Document, ev: CustomEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
  }
}
