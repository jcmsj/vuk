import { scrollIfUnseen } from "./scrollIfUnseen";

//Prevents repeat of text
function isSoleChild(n:Node) {
    return n.parentElement?.childElementCount == 1
}

function visitChild(l:HTMLElement) {
    return l.childElementCount > 1;
}
function skip(n:Node) {
    const l = n as HTMLElement
    let result = NodeFilter.FILTER_ACCEPT;
    if (
    visitChild(l)
    || isSoleChild(n)
    )
        result = NodeFilter.FILTER_SKIP;
    return  result;
}

export var walker:TreeWalker;
export function setWalker(root:HTMLElement) {
    walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, skip);
    walker.nextNode() //Skip the root
}

export function follow() {
    scrollIfUnseen(walker.currentNode as HTMLElement)
}