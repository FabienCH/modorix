export async function lookForHtmlElements(
  querySelector: string
): Promise<HTMLElement[]> {
  return new Promise((resolve, reject) => {
    let elems;
    const lookupInterval = setInterval(() => {
      elems = findElements(querySelector);
      if (elems.length) {
        resolve([...elems]);
      }
    }, 300);
    setTimeout(() => {
      clearInterval(lookupInterval);
      reject("elem not found");
    }, 6000);
  });
}

function findElements(querySelector: string): NodeListOf<HTMLElement> {
  return document.querySelectorAll(querySelector);
}
