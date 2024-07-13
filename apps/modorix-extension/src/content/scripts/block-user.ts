import { lookForHtmlElement } from '../../shared/html-utils/look-for-html-element';
import { sendXUserBlockedFailure, sendXUserBlockedSuccess } from '../infrastructure/messages-handlers/messages-sender';

(async () => {
  const userNameContainer = await lookForHtmlElement("[data-testid='UserName']");
  const userName =
    [...(userNameContainer?.querySelectorAll('span') ?? [])].find((spanElem) => spanElem?.innerText.startsWith('@'))?.innerText ?? '';

  const plusBtn = await lookForHtmlElement("[data-testid='userActions']");
  plusBtn?.click();

  const blockBtn = await lookForHtmlElement("[data-testid='block']");
  blockBtn?.click();

  const confirmBlockBtn = await lookForHtmlElement("[data-testid='confirmationSheetConfirm']");

  if (confirmBlockBtn) {
    const blockReasonIdsStr = await chrome.storage.local.get('blockReasonIds');
    const blockReasonIds = JSON.parse(blockReasonIdsStr.blockReasonIds);
    confirmBlockBtn.click();
    await sendXUserBlockedSuccess(userName, blockReasonIds);
  } else {
    await sendXUserBlockedFailure(userName);
  }
})();
