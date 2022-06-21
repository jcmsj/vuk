/**
 * @param {HTMLElement} elem 
 */
 function getScrollPercentage(elem) {
    let p = 0;
    if (elem instanceof HTMLElement)
        p = (elem.scrollTop / elem.scrollHeight * 100).toFixed(4)

    return p
}

export default getScrollPercentage