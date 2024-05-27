export function lookForHtmlElements(
  querySelector: string,
  timeout = 10000
): Promise<HTMLElement[]> {
  return new Promise((resolve, reject) => {
    let elems: NodeListOf<HTMLElement>;
    const lookupInterval = setInterval(() => {
      elems = findElements(querySelector);
      if (elems.length) {
        clearInterval(lookupInterval);
        setTimeout(() => {
          resolve([...elems]);
        }, 200);
      }
    }, 200);
    setTimeout(() => {
      if (!elems.length) {
        clearInterval(lookupInterval);
        const message = `Elements with querySelector ${querySelector} not found in ${timeout / 1000} secondes`;
        console.warn(message);
        reject(message);
      }
    }, timeout);
  });
}

function findElements(querySelector: string): NodeListOf<HTMLElement> {
  return document.querySelectorAll(querySelector);
}
