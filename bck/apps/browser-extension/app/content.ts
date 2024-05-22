console.log("The extension is up and running");

/* 
setTimeout(()=> {
    const toto = document.querySelector("[data-testid='User-Name']")
    chrome.tabs.create({ url: 'https://x.com/'+toto.getElementsByTagName('a')[0].href, active: false },    function(tab)
    {
        const plusBtn = document.querySelector("[aria-label='Plus']")
        console.log("🚀 000 ~ a.addEventListener ~ plusBtn:", plusBtn)
        plusBtn.click()
        const blockBtn = document.querySelector("[data-testid='block']")
        console.log("🚀 000 ~ a.addEventListener ~ blockBtn:", blockBtn)
        blockBtn.clock()

        const confirmBlockBtn = document.querySelector("[data-testid='confirmationSheetConfirm']")
        console.log("🚀 000 ~ a.addEventListener ~ confirmBlockBtn:", confirmBlockBtn)

        confirmBlockBtn.click()
        setTimeout(()=> {
            chrome.tabs.remove(tab.id);

        },1000)
    });

},4000) */

/* 
async function lookForHtmlElements(querySelector) {
    return  new Promise((resolve, reject) => {
        let elem
        const lookupInterval=setInterval(()=> {
            elem =findElements(querySelector)
            console.log("🚀 ~ lookupInterval ~ elem:", elem)
        if(elem.length){
            clearInterval(lookupInterval)
            resolve(elem)
        }},300)
        setTimeout(()=> {
            clearInterval(lookupInterval)
            console.log('elem not found')
            reject('elem not found')
        },6000)
      });
}

function findElements(querySelector) {
    return document.querySelectorAll(querySelector)
} */

import { lookForHtmlElements } from "./look-for-html-elements";

(async () => {
  const toto = await lookForHtmlElements("[data-testid='User-Name']");
  console.log("🚀 ~ toto:", toto);

  toto.forEach((tutu) => {
    const a = document.createElement("a");
    a.appendChild(document.createTextNode("Test"));
    console.log("🚀 ~ a:", a);

    a.addEventListener("click", async (e) => {
      console.log("🚀 ~ btn.addEventListener ~ e:", e);

      const response = await chrome.runtime.sendMessage("", {
        id: "openTab",
        data: { url: tutu.getElementsByTagName("a")[0]?.href, active: true },
      });

      console.log("message sent ! response", response);
    });

    tutu.appendChild(a);
  });
})();
