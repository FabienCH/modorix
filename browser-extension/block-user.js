

(async () => {
    const lookForHtmlElement = require('./look-for-html-element.js');


    const plusBtn = await lookForHtmlElement("[aria-label='Plus']")
    plusBtn.click()

        const blockBtn =  await lookForHtmlElement("[data-testid='block']")
        blockBtn.click()

            const confirmBlockBtn =  await lookForHtmlElement("[data-testid='confirmationSheetConfirm']",console)

            confirmBlockBtn.click()
  })();




