import { UserBlockedSuccessMessageData } from '../../shared/messages/event-message';
import { MessageIds } from '../../shared/messages/message-ids.enum';

((_) => {
  const XHR = XMLHttpRequest.prototype as XMLHttpRequest & {
    _method: string;
    _url: string | URL;
    _async: boolean;
    _requestHeaders: Record<string, string>;
    _startTime: string;
  };

  const open = XHR.open;
  const send = XHR.send;
  const setRequestHeader = XHR.setRequestHeader;

  XHR.open = function (method: string, url: string | URL) {
    this._method = method;
    this._url = url;
    this._requestHeaders = {};
    this._startTime = new Date().toISOString();

    return open.apply(this, [method, url, true]);
  };

  XHR.setRequestHeader = function (name, value) {
    this._requestHeaders[name] = value;
    return setRequestHeader.apply(this, [name, value]);
  };

  XHR.send = function (postData) {
    const loadCallback = async function (this: typeof XHR) {
      const url = this._url && typeof this._url === 'string' ? this._url.toLowerCase() : this._url;
      if (url && url === 'https://x.com/i/api/1.1/blocks/create.json') {
        if (this.responseType !== 'blob' && this.responseText) {
          try {
            const response = JSON.parse(this.responseText);
            if ('id_str' in response && 'screen_name' in response) {
              const xUserId = response.id_str;
              const data: UserBlockedSuccessMessageData = { status: 'SUCCESS', xUserId, xUsername: response.screen_name };
              document.dispatchEvent(new CustomEvent(MessageIds.USER_BLOCKED, { detail: data }));
            }
          } catch (err) {
            console.error(`Couldn't block user ${JSON.stringify(err)}`);
          }
        }
      }
    };
    this.addEventListener('load', loadCallback);

    return send.apply(this, [postData]);
  };
})(XMLHttpRequest);
