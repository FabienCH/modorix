import { MessageIds } from "./core/message-ids.enum";
import { ResourceType, RuleActionType } from "./core/network-rules-enums";

console.log("background loaded !");

async function terminateBlockUser(tabId: number | undefined) {
  const netRequestRules = await chrome.declarativeNetRequest.getSessionRules();
  await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: netRequestRules.map((rule) => rule.id),
  });

  if (tabId) {
    chrome.tabs.remove(tabId);
  }
}

async function runBlockUser(
  tabId: number,
  changesInfos: chrome.tabs.TabChangeInfo
) {
  if (tabId === tab?.id && changesInfos.status === "complete") {
    chrome.tabs.onUpdated.removeListener(runBlockUser);
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["src/scripts/block-user.js"],
    });
  }
}

async function openNewTab(request: any) {
  tab = await chrome.tabs.create({
    url: request.data.url,
    active: request.data.active,
  });

  await chrome.declarativeNetRequest.updateSessionRules({
    addRules: [
      {
        id: 1,
        priority: 3,
        action: { type: RuleActionType.BLOCK },
        condition: {
          tabIds: tab?.id ? [tab.id] : undefined,
          urlFilter: "https://*.twimg.com/*",
          resourceTypes: [
            ResourceType.STYLESHEET,
            ResourceType.IMAGE,
            ResourceType.MEDIA,
          ],
        },
      },
      {
        id: 3,
        priority: 2,
        action: { type: RuleActionType.BLOCK },
        condition: {
          tabIds: tab?.id ? [tab.id] : undefined,
          urlFilter: "https://*.twimg.com/*emoji*",
        },
      },
      {
        id: 5,
        priority: 1,
        action: { type: RuleActionType.BLOCK },
        condition: {
          tabIds: tab?.id ? [tab.id] : undefined,
          urlFilter: "https://video.twimg.com",
        },
      },
    ],
  });

  chrome.tabs.onUpdated.addListener(runBlockUser);
}

let lastTabUpdate: { status?: string; url?: string } = {
  status: undefined,
  url: undefined,
};
chrome.tabs.onUpdated.addListener(
  (tabId: number, changesInfos: chrome.tabs.TabChangeInfo) => {
    console.log("tabs.onUpdated.addListener tabId", tabId);
    console.log(
      "tabs.onUpdated.addListener changesInfos url",
      changesInfos.url
    );
    console.log(
      "tabs.onUpdated.addListener changesInfos status",
      changesInfos.status
    );
    if (changesInfos.status) {
      lastTabUpdate.status = changesInfos.status;
    }
    if (changesInfos.url) {
      lastTabUpdate.url = changesInfos.url;
    }
    console.log("🚀 ~ lastTabUpdate:", lastTabUpdate);

    if (
      lastTabUpdate.status === "complete" &&
      lastTabUpdate.url?.startsWith("https://x.com/home")
    ) {
      lastTabUpdate = { status: undefined, url: undefined };
      chrome.tabs.sendMessage(tabId, {
        id: MessageIds.HOME_LOADED,
      });
      console.log("HOME_LOADED message SNET");
    }
  }
);

let tab: chrome.tabs.Tab | null = null;
chrome.runtime.onMessage.addListener(async (request) => {
  if (request.id === MessageIds.OPEN_TAB) {
    await openNewTab(request);
  }

  if (request.id === MessageIds.USER_BLOCKED) {
    if (request.data.status === "FAILURE") {
      console.warn(request.data.message);
    }
    if (request.data.status === "SUCCESS") {
      await fetch("http://localhost:3000/api/block-user", {
        method: "POST",
        body: JSON.stringify({
          id: request.data.userId,
          blockedAt: new Date().toISOString(),
        }),
      });
      console.warn(request.data.message);
    }

    terminateBlockUser(tab?.id);
  }
});
