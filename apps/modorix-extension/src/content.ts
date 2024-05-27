console.log("The extension is up and running");

import { lookForHtmlElement } from "./core/look-for-html-element";
import { lookForHtmlElements } from "./core/look-for-html-elements";
import { MessageIds } from "./core/message-ids.enum";

chrome.runtime.onMessage.addListener((message) => {
  console.log("🚀 ~ chrome.runtime.onMessage.addListener ~ message:", message);
  if (message.id === MessageIds.HOME_LOADED) {
    listenForUsernameEnter();
  }
});

async function addButton(linkElement: HTMLLinkElement) {
  console.log(
    "🚀 ~ linkElement.addEventListener MOUSEENETER ~ linkElement:",
    linkElement
  );
  const cardElement = await lookForHtmlElement("[data-testid='HoverCard']");
  console.log("🚀 ~ linkElement.addEventListener ~ cardElements:", cardElement);
  console.log("🚀 ~ linkElement.addEventListener ~ cardElement:", cardElement);

  const buttons = cardElement.getElementsByTagName("button");
  const buttonsContainer = buttons[0].parentElement;
  const button = document.createElement("button");
  button.style.borderColor = "rgba(0, 0, 0, 0)";
  button.style.backgroundColor = "rgba(244, 33, 46)";
  button.style.padding = "9px 24px";
  button.style.marginTop = "12px";
  button.style.borderRadius = "24px";
  button.style.fontSize = "14px";
  button.style.fontWeight = "700";
  button.style.fontFamily =
    "TwitterChirp, Roboto, Helvetica, Arial, sans-serif";

  button.addEventListener("click", async (_) => {
    await chrome.runtime.sendMessage("", {
      id: MessageIds.OPEN_TAB,
      data: {
        url: linkElement.href,
        active: true,
      },
    });
  });

  button.appendChild(document.createTextNode("Block with Modorix"));
  buttonsContainer?.appendChild(button);
}

async function addMouseEnterListenerOnCardsDisappear(
  linkElement: HTMLLinkElement
) {
  let cardElement: HTMLElement | null = await lookForHtmlElement(
    "[data-testid='HoverCard']",
    { intervalDelay: 50 }
  );
  console.log(
    "🚀 ~ addMouseEnterListenerOnCardsDisappear ~ cardElement:",
    cardElement
  );
  const lookupInterval = setInterval(async () => {
    cardElement = document.querySelector("[data-testid='HoverCard']");
    if (!cardElement) {
      console.log("NO CARD ELEMENT");
      clearInterval(lookupInterval);
      listenToUserNameLinkMouseEnter(linkElement);
    }
  }, 50);
}

function listenToUserNameLinkMouseEnter(linkElement: HTMLLinkElement) {
  linkElement.addEventListener(
    "mouseenter",
    () => {
      addButton(linkElement);
      addMouseEnterListenerOnCardsDisappear(linkElement);
    },
    { once: true }
  );
}

async function listenForUsernameEnter() {
  const userNameLinksElements = await lookForHtmlElements(
    "[data-testid='User-Name'][id] a:not(:has(> time))"
  );
  console.log(
    "🚀 ~ listenForUsernameHover ~ userNameLinksElements:",
    userNameLinksElements
  );
  userNameLinksElements.forEach((linkElement) => {
    console.log("🚀 ~ .forEach ~ linkElement WILL LISTEN:", linkElement);
    listenToUserNameLinkMouseEnter(linkElement as HTMLLinkElement);
  });

  return userNameLinksElements;
}

(async () => {
  let userNameLinksElements = await listenForUsernameEnter();
  document.addEventListener("scrollend", async (event) => {
    console.log("🚀 ~ document.addEventListener ~ scrollend  event:", event);
    userNameLinksElements.forEach((linkElement) => {
      linkElement.removeEventListener("mouseenter", () => {
        addButton(linkElement as HTMLLinkElement);
        addMouseEnterListenerOnCardsDisappear(linkElement as HTMLLinkElement);
      });
    });
    userNameLinksElements = await listenForUsernameEnter();
  });
})();
