/**
 * Wraps the fragment with a div
 */
function simplifyHTMLTree(fragment:DocumentFragment) {
    if (!(fragment instanceof DocumentFragment))
        throw new TypeError("Not an element")

    const div = document.createElement("div");
    div.append(...fragment.children as unknown as Element[])
    
    return div
}

export default simplifyHTMLTree;