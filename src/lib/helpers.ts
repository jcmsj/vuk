/**
 * https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text * 
 */
export function getSelectionText(): string {
    return window.getSelection()?.toString() || "";
}

/**
 * https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport
 */
export function isElementInViewport(el: HTMLElement): boolean {
    const rect = el.getBoundingClientRect();
    return rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth);
}

export function refocus(el: Element) {
    el && el.scrollIntoView({ block: "start", behavior: "smooth" })
    return el;
}