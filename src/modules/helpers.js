/**
 * https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text * 
 * @returns String
 */
 export function getSelectionText() {
    let text = "";
    if (window.getSelection)
        text = window.getSelection().toString();
    else if (document.selection && document.selection.type != "Control")
        text = document.selection.createRange().text;

    return text;
}

/**
 * https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport
 * @param {HTMLElement} el 
 * @returns boolean
 */
export function isElementInViewport (el) {

    const rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && 
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * @param {Element} lem 
 */
export function refocus(lem) {
    lem && lem.scrollIntoView({ block: "start" })
}