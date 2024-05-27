export function lookForHtmlElement(
  querySelector: string,
  timeout = 10000
): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    let elem: HTMLElement | null;
    const lookupInterval = setInterval(() => {
      elem = findElement(querySelector);
      if (elem) {
        clearInterval(lookupInterval);
        setTimeout(() => {
          resolve(elem as HTMLElement);
        }, 200);
      }
    }, 200);
    setTimeout(() => {
      if (!elem) {
        clearInterval(lookupInterval);
        const message = `Element with querySelector ${querySelector} not found in ${timeout / 1000} secondes`;
        console.warn(message);
        reject(message);
      }
    }, timeout);
  });
}

function findElement(querySelector: string): HTMLElement | null {
  return document.querySelector(querySelector);
}
