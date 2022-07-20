const type = {
    cover: "cover",
    chapter: "chapter"
}
/**
 * 
 * @param {DocumentFragment} fragment
 * @returns {HTMLElement}
 * Simplifies HTML structure of chapters by keeping the nearest descendant that contains the actual text as well as removing containers for IMGs.
 */
function simplifyHTMLTree(fragment) {
    if (!(fragment instanceof DocumentFragment))
        throw new TypeError("Not an element")

    const div = document.createElement("div");
    div.append(...fragment.children)
    
    return div
}

export default simplifyHTMLTree;