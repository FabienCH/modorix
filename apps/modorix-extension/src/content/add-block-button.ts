import { lookForHtmlElement } from '../core/look-for-html-element';
import { MessageIds } from '../core/message-ids.enum';

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
  const modorixBlockButton = cardElement.querySelector('#modorix-block-button');
  const cardLink = cardElement.children[0]?.children[0]?.children[1]?.querySelector('a');

  if (modorixBlockButton || cardLink?.href !== linkElement.href) {
    return;
  }

  const buttons = cardElement.getElementsByTagName('button');
  const buttonsContainer = buttons[0]?.parentElement;
  const button = document.createElement('button');
  button.id = 'modorix-block-button';
  button.style.borderColor = 'rgba(0, 0, 0, 0)';
  button.style.backgroundColor = 'rgba(244, 33, 46)';
  button.style.padding = '9px 12px';
  button.style.marginTop = '12px';
  button.style.borderRadius = '24px';
  button.style.fontSize = '14px';
  button.style.fontWeight = '700';
  button.style.fontFamily = 'TwitterChirp, Roboto, Helvetica, Arial, sans-serif';

  button.addEventListener('click', async (_) => {
    await chrome.runtime.sendMessage('', {
      id: MessageIds.OPEN_TAB,
      data: {
        url: linkElement.href,
        active: true,
      },
    });
  });

  button.appendChild(document.createTextNode('Block with Modorix'));
  buttonsContainer?.appendChild(button);
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
