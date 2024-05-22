export async function lookForHtmlElement(querySelector) {
    return  new Promise((resolve, reject) => {
        let elem
        const lookupInterval=setInterval(()=> {
            elem =findElement(querySelector)
        if(elem){
            resolve(elem)
        }},300)
        setTimeout(()=> {
            clearInterval(lookupInterval)
            reject('elem not found')
        },6000)
      });
}

function findElement(querySelector) {
    return document.querySelector(querySelector)
}