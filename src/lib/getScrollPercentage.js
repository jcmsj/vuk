/**
 * @param {HTMLElement} elem 
 */
function getScrollPercentage(elem) {
    let p = 0;
    if (elem instanceof HTMLElement)
        p = (elem.scrollTop / elem.scrollHeight * 100).toFixed(2)

    return p
}

export default getScrollPercentage