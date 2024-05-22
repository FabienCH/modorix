export async function lookForHtmlElements(querySelector) {
    return  new Promise((resolve, reject) => {
        let elem
        const lookupInterval=setInterval(()=> {
            elem =findElements(querySelector)
        if(elem){
            resolve(elem)
        }},300)
        setTimeout(()=> {
            clearInterval(lookupInterval)
            reject('elem not found')
        },6000)
      });
}

function findElements(querySelector) {
    return document.querySelectorAll(querySelector)
}