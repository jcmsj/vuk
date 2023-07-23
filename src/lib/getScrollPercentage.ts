export default function getScrollPercentage(elem?:HTMLElement) {
    if (elem instanceof HTMLElement)
        return parseInt((elem.scrollTop / elem.scrollHeight * 100).toFixed(2));

    return 0;
}
