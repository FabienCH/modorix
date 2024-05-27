console.log("The extension is up and running");

import { lookForHtmlElements } from "./core/look-for-html-elements";
import { MessageIds } from "./core/message-ids.enum";

(async () => {
  const userNameElements = await lookForHtmlElements(
    "[data-testid='User-Name'][id]"
  );

  userNameElements.forEach((userNameElement) => {
    const a = document.createElement("a");
    a.appendChild(document.createTextNode("Test"));

    a.addEventListener("click", async (_) => {
      await chrome.runtime.sendMessage("", {
        id: MessageIds.OPEN_TAB,
        data: {
          url: userNameElement.getElementsByTagName("a")[0]?.href,
          active: true,
        },
      });
    });

    userNameElement.appendChild(a);
  });
})();
