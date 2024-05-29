import { lookForHtmlElements } from "../core/look-for-html-elements";
import { addButtonToCard } from "./add-button";

let userNameListenerHandlers: Array<() => Promise<void>> = [];
let lastEventToUpdateUsernamesListenerAt: number;

export function updateUsernamesListener(userNameLinksElements: HTMLElement[]) {
  debounceUpdateUsernamesListener(async () => {
    if (userNameLinksElements?.length) {
      removeUsernamesMouseEnterListener(userNameLinksElements);
    }
    userNameLinksElements = await listenForUsernamesMouseEnter();
  });
}

export async function listenForUsernamesMouseEnter() {
  const userNameLinksElements = await lookForHtmlElements(
    "[data-testid='User-Name'][id] a:not(:has(> time))"
  );

  userNameLinksElements.forEach((linkElement) => {
    listenToUserNameLinkMouseEnter(linkElement as HTMLAnchorElement);
  });

  return userNameLinksElements;
}

function removeUsernamesMouseEnterListener(
  userNameLinksElements: HTMLElement[]
) {
  userNameLinksElements.forEach((linkElement, index) => {
    linkElement.removeEventListener(
      "mouseenter",
      userNameListenerHandlers[index]
    );
  });
  userNameListenerHandlers = [];
}

function debounceUpdateUsernamesListener(callback: Function) {
  lastEventToUpdateUsernamesListenerAt = Date.now();

  setTimeout(() => {
    const now = Date.now();
    if (now - lastEventToUpdateUsernamesListenerAt >= 300) {
      callback();
    }
  }, 300);
}

const listenToUserNameLinkMouseEnter = (linkElement: HTMLAnchorElement) => {
  const functionWrapper = addButtonToCard.bind(this, linkElement);
  userNameListenerHandlers.push(functionWrapper);
  linkElement.addEventListener("mouseenter", functionWrapper);
};
