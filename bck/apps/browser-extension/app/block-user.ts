import { lookForHtmlElement } from "./look-for-html-element";

(async () => {
  const plusBtn = await lookForHtmlElement("[aria-label='Plus']");
  plusBtn.click();

  const blockBtn = await lookForHtmlElement("[data-testid='block']");
  blockBtn.click();

  const confirmBlockBtn = await lookForHtmlElement(
    "[data-testid='confirmationSheetConfirm']"
  );

  confirmBlockBtn.click();
})();
