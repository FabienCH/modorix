export function lookForHtmlElements(querySelector: string, timeout = 10000): Promise<HTMLElement[]> {
  return new Promise((resolve) => {
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
        console.warn(`Elements with querySelector ${querySelector} not found in ${timeout / 1000} secondes`);
        resolve([...elems]);
      }
    }, timeout);
  });
}

function findElements(querySelector: string): NodeListOf<HTMLElement> {
  return document.querySelectorAll(querySelector);
}
