import { lookForHtmlElement } from '../shared/html-utils/look-for-html-element';
import { MessageIds } from '../shared/message-ids.enum';
import { UserBlockedMessageFailureData, UserBlockedMessageSuccessData } from '../shared/messages/event-message';

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
    const data: UserBlockedMessageSuccessData = { status: 'SUCCESS', userId: userName, blockReasonIds };
    await chrome.runtime.sendMessage('', {
      id: MessageIds.USER_BLOCKED,
      data,
    });
  } else {
    const data: UserBlockedMessageFailureData = {
      status: 'FAILURE',
      message: `Couldn't block user ${userName}`,
    };
    await chrome.runtime.sendMessage('', {
      id: MessageIds.USER_BLOCKED,
      data,
    });
  }
})();
