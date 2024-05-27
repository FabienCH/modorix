import { lookForHtmlElement } from "../core/look-for-html-element";
import { MessageIds } from "../core/message-ids.enum";

(async () => {
  try {
    const plusBtn = await lookForHtmlElement("[data-testid='userActions']");
    plusBtn.click();

    const blockBtn = await lookForHtmlElement("[data-testid='block']");
    blockBtn.click();

    const confirmBlockBtn = await lookForHtmlElement(
      "[data-testid='confirmationSheetConfirm']"
    );
    confirmBlockBtn.click();

    await chrome.runtime.sendMessage("", {
      id: MessageIds.USER_BLOCKED,
      data: { status: "SUCCESS" },
    });
  } catch (_) {
    const userNameContainer = await lookForHtmlElement(
      "[data-testid='UserName']"
    );

    const userName = [
      ...(userNameContainer.querySelectorAll("span") ?? []),
    ].find((spanElem) => spanElem?.innerText.startsWith("@"))?.innerText;

    await chrome.runtime.sendMessage("", {
      id: MessageIds.USER_BLOCKED,
      data: {
        status: "FAILURE",
        message: `Couldn't block user ${userName}`,
      },
    });
  }
})();
