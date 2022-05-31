const type = {
    cover: "cover",
    chapter: "chapter"
}
/**
 * 
 * @param {HTMLElement} fragment
 * @returns {HTMLElement}
 * Simplifies HTML structure of chapters by keeping the nearest descendant that contains the actual text as well as removing containers for IMGs.
 */
function simplifyHTMLTree(fragment) {

    if (!(fragment instanceof HTMLElement))
        throw new TypeError("Not an element")

    let rootElem = fragment
    let end = false;
    let tries = 100
    while(!end && tries) {
        switch(rootElem.childElementCount) {
            case 0:
                //If the deepest descendant is an IMG then it must be a cover page.
                if (rootElem instanceof HTMLImageElement) {
                    end = type.cover;
                } else {
                    rootElem = rootElem.parentElement.nextElementSibling
                }
            break;
            case 1:
                rootElem = rootElem.firstElementChild
            break;

            //If there are multiple childs then this must be a chapter.
            default:
                end = type.chapter;
            break;
        }

        tries--;
    }
    if (tries == 0) {
        throw Error("inifnite loop:", rootElem)
    }
    if (end == type.cover) {
        const div = document.createElement("div")
        div.appendChild(rootElem)
        return div;
    }

    for (const IMG of rootElem.querySelectorAll("IMG")) {
        if (rootElem.isSameNode(IMG.parentElement)) {
            continue
        }

        let elem = IMG.parentElement;
        //Locates the root's direct child that the IMG element descends from, then replaces it with the IMG. Note that the previous descendant is removed.
        while(true) {            
            if (rootElem.isSameNode(elem)) {
                rootElem.replaceWith(IMG , elem)
                break;
            } else {
                elem = elem.parentElement
            }
        }
    }

    return rootElem
}

export default simplifyHTMLTree;