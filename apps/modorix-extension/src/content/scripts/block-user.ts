import { lookForHtmlElement } from '../../shared/html-utils/look-for-html-element';
import { MessageIds } from '../../shared/messages/message-ids.enum';
import {
  sendRequestBlockXUserMessage,
  sendXUserBlockedFailureMessage,
  sendXUserBlockedSuccessMessage,
} from '../infrastructure/messages-handlers/messages-sender';

function injectBlockRequestListenerScript() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('src/content/scripts/block-request-listener.js');
  script.onload = function () {
    script.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}

(async () => {
  injectBlockRequestListenerScript();
  const usernameContainer = await lookForHtmlElement("[data-testid='UserName']");
  const xUsername =
    [...(usernameContainer?.querySelectorAll('span') ?? [])].find((spanElem) => spanElem?.innerText.startsWith('@'))?.innerText ?? '';

  const plusBtn = await lookForHtmlElement("[data-testid='userActions']");
  plusBtn?.click();

  const blockBtn = await lookForHtmlElement("[data-testid='block']");
  blockBtn?.click();

  const confirmBlockBtn = await lookForHtmlElement("[data-testid='confirmationSheetConfirm']");

  if (confirmBlockBtn) {
    const blockData = await chrome.storage.local.get(['blockReasonIds', 'groupIds']);
    const blockReasonIds = JSON.parse(blockData.blockReasonIds);
    const groupIds = JSON.parse(blockData.groupIds);
    confirmBlockBtn.click();
    await sendRequestBlockXUserMessage(xUsername, blockReasonIds, groupIds);
    document.addEventListener(
      MessageIds.USER_BLOCKED,
      async (event) => {
        await sendXUserBlockedSuccessMessage(event);
      },
      { once: true },
    );
  } else {
    await sendXUserBlockedFailureMessage(xUsername);
  }
})();
