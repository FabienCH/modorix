export function lookForHtmlElement(
  querySelector: string,
  options?: { timeout?: number; intervalDelay?: number }
): Promise<HTMLElement> {
  const timeout = options?.timeout ?? 1000;
  const intervalDelay = options?.intervalDelay ?? 200;
  return new Promise((resolve, reject) => {
    let elem: HTMLElement | null;
    const lookupInterval = setInterval(() => {
      elem = findElement(querySelector);
      if (elem) {
        clearInterval(lookupInterval);
        setTimeout(() => {
          resolve(elem as HTMLElement);
        }, intervalDelay);
      }
    }, intervalDelay);
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
