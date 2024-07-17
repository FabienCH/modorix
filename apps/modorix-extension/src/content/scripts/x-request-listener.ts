import { SetHeadersMessageData } from '../../shared/messages/event-message';
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
  const loadCallback = async function (this: typeof XHR) {
    const url = this._url && typeof this._url === 'string' ? this._url.toLowerCase() : this._url.toString();
    if (url && url.startsWith('https://x.com/i/api/1.1')) {
      const data: SetHeadersMessageData = { requestHeaders: this._requestHeaders };
      document.dispatchEvent(new CustomEvent(MessageIds.SET_HEADERS, { detail: data }));
      this.removeEventListener('load', loadCallback);
    }
  };

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
    this.addEventListener('load', loadCallback);
    return send.apply(this, [postData]);
  };
})(XMLHttpRequest);
