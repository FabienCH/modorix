import { onSetHeadersMessage } from './infrastructure/messages-handlers/messages-listener';

export function waitForXHeaders(timeout: number): Promise<Record<string, string> | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, timeout);

    onSetHeadersMessage((data) => {
      resolve(data.requestHeaders);
    });
  });
}
