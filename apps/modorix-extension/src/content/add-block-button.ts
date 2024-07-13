import '@modorix-ui/globals.css';
import { lookForHtmlElement } from '../shared/html-utils/look-for-html-element';
import { BlockUserMessageData } from '../shared/messages/event-message';
import { MessageIds } from '../shared/messages/message-ids.enum';
import { renderBlockButton } from './infrastructure/components/render-block-button';

export async function addBlockButtonToCard(linkElement: HTMLAnchorElement) {
  const cardElement = await lookForHtmlElement("[data-testid='HoverCard']", {
    intervalDelay: 50,
  });
  if (!cardElement) {
    return;
  }

  addBlockButton(cardElement, linkElement);
  addButtonIfCardChanges(cardElement, linkElement);
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

  const handleConfirmModal = async (blockReasonIds: string[]) => {
    const data: BlockUserMessageData = {
      url: linkElement.href,
      active: true,
      blockReasonIds,
    };
    await chrome.runtime.sendMessage('', {
      id: MessageIds.BLOCK_USER,
      data,
    });
  };

  renderBlockButton(buttonsContainer, linkElement, handleConfirmModal);
}

function addButtonIfCardChanges(cardElement: HTMLElement, linkElement: HTMLAnchorElement) {
  let newCardElement: HTMLElement | null;
  const lookupInterval = setInterval(async () => {
    newCardElement = await lookForHtmlElement("[data-testid='HoverCard']", {
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
