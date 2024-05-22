import { ResourceType, RuleActionType } from "./chrome-enums";

console.log("background loaded !");

chrome.declarativeNetRequest.getDynamicRules().then((netRequestRules) => {
  console.log("🚀 ~ netRequestRules:", netRequestRules);
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: netRequestRules.map((rule) => rule.id),
  });
});

chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  console.log(
    "🚀 BACKGROUND ~ chrome.runtime.onMessage.addListener ~ request:",
    request
  );
  if (request.id === "openTab") {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: 12,
          priority: 3,
          action: { type: RuleActionType.BLOCK },
          condition: {
            urlFilter: "https://*.twimg.com/*",
            resourceTypes: [
              ResourceType.STYLESHEET,
              ResourceType.IMAGE,
              ResourceType.MEDIA,
            ],
          },
        },
        {
          id: 22,
          priority: 2,
          action: { type: RuleActionType.BLOCK },
          condition: { urlFilter: "https://*.twimg.com/*emoji*" },
        },
        {
          id: 32,
          priority: 1,
          action: { type: RuleActionType.BLOCK },
          condition: { urlFilter: "https://video.twimg.com" },
        },
      ],
    });
    chrome.tabs.create(
      { url: request.data.url, active: request.data.active },
      function (tab) {
        console.log("🚀 ~ chrome.runtime.onMessage.addListener ~ tab:", tab);

        if (tab.id) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["block-user.js"],
          });
        }

        setTimeout(async () => {
          const netRequestRules =
            await chrome.declarativeNetRequest.getDynamicRules();
          console.log("🚀 ~ setTimeout ~ netRequestRules:", netRequestRules);
          if (tab.id) {
            chrome.tabs.remove(tab.id);
          }
          chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: netRequestRules.map((rule) => rule.id),
          });
        }, 40000);
      }
    );
  }
});
