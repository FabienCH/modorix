export async function lookForHtmlElement(
  querySelector: string
): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    let elem;
    const lookupInterval = setInterval(() => {
      elem = findElement(querySelector);
      if (elem) {
        resolve(elem);
      }
    }, 300);
    setTimeout(() => {
      clearInterval(lookupInterval);
      reject("elem not found");
    }, 6000);
  });
}

function findElement(querySelector: string): HTMLElement | null {
  return document.querySelector(querySelector);
}
