import { ChapterTransformer } from "@jcsj/epub/lib/sanitize";

/**
 * Wraps the fragment with a div to get the innerHTML
 */
export const simplifyHTMLTree:ChapterTransformer = frag => {
    if (!(frag instanceof DocumentFragment))
        throw TypeError("Not a DocumentFragment")

    return Array.from(frag.children).reduce((s, child) => s + child.outerHTML, "")
}

export default simplifyHTMLTree;