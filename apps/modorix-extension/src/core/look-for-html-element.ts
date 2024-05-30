export function lookForHtmlElement(
  querySelector: string,
  options?: { timeout?: number; intervalDelay?: number },
): Promise<HTMLElement | null> {
  const timeout = options?.timeout ?? 10000;
  const intervalDelay = options?.intervalDelay ?? 200;
  return new Promise((resolve) => {
    let elem: HTMLElement | null;
    const lookupInterval = setInterval(() => {
      elem = findElement(querySelector);
      if (elem) {
        clearInterval(lookupInterval);
        setTimeout(() => {
          resolve(elem);
        }, intervalDelay);
      }
    }, intervalDelay);
    setTimeout(() => {
      if (!elem) {
        clearInterval(lookupInterval);
        console.warn(`Element with querySelector ${querySelector} not found in ${timeout / 1000} secondes`);
        resolve(elem);
      }
    }, timeout);
  });
}

function findElement(querySelector: string): HTMLElement | null {
  return document.querySelector(querySelector);
}
