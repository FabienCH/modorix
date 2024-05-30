import { lookForHtmlElements } from '../core/look-for-html-elements';
import { addBlockButtonToCard } from './add-block-button';

let userNameLinksElements: HTMLElement[] = [];
let userNameListenerHandlers: Array<() => Promise<void>> = [];
let lastEventToUpdateUsernamesListenerAt: number;

export function updateUsernamesListener() {
  debounceUpdateUsernamesListener(async () => {
    if (userNameLinksElements.length) {
      removeUsernamesMouseEnterListener();
    }
    await listenForUsernamesMouseEnter();
  });
}

export async function listenForUsernamesMouseEnter() {
  userNameLinksElements = await lookForHtmlElements("[data-testid='User-Name'][id] a:not(:has(> time))");

  userNameLinksElements.forEach((linkElement) => {
    listenToUserNameLinkMouseEnter(linkElement as HTMLAnchorElement);
  });
}

function removeUsernamesMouseEnterListener() {
  userNameLinksElements.forEach((linkElement, index) => {
    linkElement.removeEventListener('mouseenter', userNameListenerHandlers[index]);
  });
  userNameListenerHandlers = [];
}

function debounceUpdateUsernamesListener(callback: () => Promise<void>) {
  lastEventToUpdateUsernamesListenerAt = Date.now();

  setTimeout(() => {
    const now = Date.now();
    if (now - lastEventToUpdateUsernamesListenerAt >= 300) {
      callback();
    }
  }, 300);
}

const listenToUserNameLinkMouseEnter = (linkElement: HTMLAnchorElement) => {
  const functionWrapper = addBlockButtonToCard.bind(this, linkElement);
  userNameListenerHandlers.push(functionWrapper);
  linkElement.addEventListener('mouseenter', functionWrapper);
};
