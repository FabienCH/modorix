
console.log('background loaded !')
/* chrome.webRequest.onBeforeRequest.addListener(function(details) {
    console.log("🚀 ~ chrome.webRequest.onBeforeRequest.addListener ~ details:", details)
    return {cancel: true};

}, {urls: [], types: ["image", "object"]}, ["blocking"]);*/

/* chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(
    (e)=> {
        console.log("🚀onRuleMatchedDebug ~ e:", e)
        
    }
  ) */

  
chrome.declarativeNetRequest.getDynamicRules().then(netRequestRules => {
    console.log("🚀 ~ netRequestRules:", netRequestRules)
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: netRequestRules.map(rule => rule.id),
      });
});


chrome.runtime.onMessage.addListener(function(request, _, sendResponse) {
    console.log("🚀 BACKGROUND ~ chrome.runtime.onMessage.addListener ~ request:", request)
    if (request.id === 'openTab') {
        chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [
              {
                id: 12,
                priority: 3,
                action: { type: 'block' },
                condition: { urlFilter: "https://*.twimg.com/*","resourceTypes": [
                    "stylesheet",
                    "image",
                    "media"
                ] },
              },
              {
                id: 22,
                priority: 2,
                action: { type: 'block' },
                condition: { urlFilter: "https://*.twimg.com/*emoji*"},
              },
              {
                id: 32,
                priority: 1,
                action: { type: 'block' },
                condition: { urlFilter: "https://video.twimg.com"},
              },
            ],
          });
        chrome.tabs.create({ url:request.data.url, active: request.data.active },    function(tab)
            {
                console.log("🚀 ~ chrome.runtime.onMessage.addListener ~ tab:", tab)

                //sendResponse({tabId:tab.id})
                
                    chrome.scripting.executeScript({
                        target : {tabId : tab.id},
                        files : [ "block-user.js" ],
                    });
              

                // chrome.tabs.sendMessage(  tab.id,{id:'blockTab',data:{ tabId: tab.id}})

                
       /*          const plusBtn = document.querySelector("[aria-label='Plus']")
                console.log("🚀 ~ a.addEventListener ~ plusBtn:", plusBtn)
                plusBtn.click()
                const blockBtn = document.querySelector("[data-testid='block']")
                console.log("🚀 ~ a.addEventListener ~ blockBtn:", blockBtn)
                blockBtn.clock()

                const confirmBlockBtn = document.querySelector("[data-testid='confirmationSheetConfirm']")
                console.log("🚀 ~ a.addEventListener ~ confirmBlockBtn:", confirmBlockBtn)

                confirmBlockBtn.click()*/
                setTimeout(async ()=> {
                    const netRequestRules =await chrome.declarativeNetRequest.getDynamicRules();
                    console.log("🚀 ~ setTimeout ~ netRequestRules:", netRequestRules)
                    chrome.tabs.remove(tab.id);
                    chrome.declarativeNetRequest.updateDynamicRules({
                        removeRuleIds:netRequestRules.map(rule => rule.id),
                      });
                },40000) 
            });
    } 
  });


