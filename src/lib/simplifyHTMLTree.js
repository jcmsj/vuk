const type = {
    cover: "cover",
    chapter: "chapter"
}
/**
 * 
 * @param {DocumentFragment} fragment
 * @returns {HTMLElement}
 * Wraps the fragment with a div
 */
function simplifyHTMLTree(fragment) {
    if (!(fragment instanceof DocumentFragment))
        throw new TypeError("Not an element")

    const div = document.createElement("div");
    div.append(...fragment.children)
    
    return div
}

export default simplifyHTMLTree;