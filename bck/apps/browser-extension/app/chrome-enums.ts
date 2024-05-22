export enum RuleActionType {
  BLOCK = chrome.declarativeNetRequest.RuleActionType.BLOCK,
  REDIRECT = chrome.declarativeNetRequest.RuleActionType.REDIRECT,
  ALLOW = chrome.declarativeNetRequest.RuleActionType.ALLOW,
  UPGRADE_SCHEME = chrome.declarativeNetRequest.RuleActionType.UPGRADE_SCHEME,
  MODIFY_HEADERS = chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
  ALLOW_ALL_REQUESTS = chrome.declarativeNetRequest.RuleActionType
    .ALLOW_ALL_REQUESTS,
}

export enum ResourceType {
  MAIN_FRAME = chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
  SUB_FRAME = chrome.declarativeNetRequest.ResourceType.SUB_FRAME,
  STYLESHEET = chrome.declarativeNetRequest.ResourceType.STYLESHEET,
  SCRIPT = chrome.declarativeNetRequest.ResourceType.SCRIPT,
  IMAGE = chrome.declarativeNetRequest.ResourceType.IMAGE,
  FONT = chrome.declarativeNetRequest.ResourceType.FONT,
  OBJECT = chrome.declarativeNetRequest.ResourceType.OBJECT,
  XMLHTTPREQUEST = chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
  PING = chrome.declarativeNetRequest.ResourceType.PING,
  CSP_REPORT = chrome.declarativeNetRequest.ResourceType.CSP_REPORT,
  MEDIA = chrome.declarativeNetRequest.ResourceType.MEDIA,
  WEBSOCKET = chrome.declarativeNetRequest.ResourceType.WEBSOCKET,
  OTHER = chrome.declarativeNetRequest.ResourceType.OTHER,
}
