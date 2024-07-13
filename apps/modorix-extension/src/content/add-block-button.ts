import '@modorix-ui/globals.css';
import { lookForHtmlElement } from '../shared/html-utils/look-for-html-element';
import { renderBlockButton } from './infrastructure/components/render-block-button';
import { sendBlockXUser } from './infrastructure/messages-handlers/messages-sender';

export async function addBlockButtonToCard(linkElement: HTMLAnchorElement) {
  const cardElement = await lookForHtmlElement("[data-testid='HoverCard']", {
    intervalDelay: 50,
  });
  if (!cardElement) {
    return;
  }

  addBlockButton(cardElement, linkElement);
  updateButtonIfCardChanges(cardElement, linkElement);
}

function addBlockButton(cardElement: HTMLElement, linkElement: HTMLAnchorElement) {
  const modorixBlockButton = cardElement.querySelector('#modorix-root');
  const cardLink = cardElement.children[0]?.children[0]?.children[1]?.querySelector('a');

  if (modorixBlockButton || cardLink?.href !== linkElement.href) {
    return;
  }

  const buttons = cardElement.getElementsByTagName('button');
  const buttonsContainer = buttons[0]?.parentElement;

  if (!buttonsContainer) {
    return;
  }

  renderBlockButton(buttonsContainer, linkElement, (blockReasonIds) => {
    sendBlockXUser(linkElement.href, blockReasonIds);
  });
}

function updateButtonIfCardChanges(cardElement: HTMLElement, linkElement: HTMLAnchorElement) {
  const lookupInterval = setInterval(async () => {
    const newCardElement = await lookForHtmlElement("[data-testid='HoverCard']", {
      intervalDelay: 10,
    });

    if (newCardElement && newCardElement !== cardElement) {
      clearInterval(lookupInterval);
      addBlockButton(newCardElement, linkElement);
    }
  }, 100);
  setTimeout(() => {
    clearInterval(lookupInterval);
  }, 1000);
}
