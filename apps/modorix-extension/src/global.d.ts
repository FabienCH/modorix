/// <reference types="vite/client" />
import { MessageIds } from './core/message-ids.enum';

declare global {
  interface CustomEventMap extends DocumentEventMap {
    [MessageIds.USER_BLOCKED]: UserBlockedSuccessEvent;
  }

  class UserBlockedSuccessEvent extends Event implements CustomEvent<UserBlockedSuccessMessageData> {
    initCustomEvent(
      type: string,
      bubbles?: boolean | undefined,
      cancelable?: boolean | undefined,
      detail?: UserBlockedSuccessMessageData | undefined,
    ): void;
    detail: UserBlockedSuccessMessageData;
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
