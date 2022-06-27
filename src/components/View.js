
import EnhancedEpub from "../modules/EnhancedEpub";
import { useIntersectionObserver } from "@vueuse/core";
import {ref} from "vue"
import {refocus} from "../modules/helpers"
import {nextTick} from "vue"
import { className } from "./tts/constants";
var elem = null;
export const prev = ref();
export const next = ref();
export function setView(id) {
    elem = document.getElementById(id)
}

function chap(id, html) {
    const d = document.createElement("div")
    d.id = id
    d.innerHTML = html
    d.className = className.chapter
    return d;
}
/**
 * 
 * @param {HTMLElement} elem 
 */
export function clearChilds(elem) {
    if (elem.childElementCount)
        while(elem.removeChild(elem.firstElementChild));
}
export function repaint(paintables = []) {
    if (elem == null) {
        setTimeout(() => repaint(paintables), 1000)
        return;
    }

    clearChilds(elem);
    for(const p of paintables) {
        elem.appendChild(chap(p.id, p.html))
    }

    addObserve(elem.lastElementChild)
}

function add() {
    console.log(">");
    EnhancedEpub.instance.next();
}
function prior() {
    console.log("<");
    EnhancedEpub.instance.previous();
}

/**
 * @param {HTMLElement} lem 
 */
function addObserve(lem) {
    lem.classList.add("add")
    console.log(lem);
    addObserver.observe(lem)
}

/**
 * @param {HTMLElement} lem 
 */
function dropObserve(lem) {
    lem.classList.add("rem")
    console.log(lem);
    dropObserver.observe(lem)
}

const addObserver = new IntersectionObserver(([entry], obs) => {
    if (entry.isIntersecting) {
        entry.target.classList.remove("add")
        addObserver.unobserve(entry.target)
        add()
    }
})

var hasLeft = false;
const dropObserver = new IntersectionObserver(([entry], obs) => {

    if (hasLeft == false && entry.isIntersecting == false) {
            hasLeft = true;
            entry.target.classList.add("hasleft")
    } else if (hasLeft && entry.isIntersecting) {
        dropObserver.unobserve(entry.target)
        entry.target.classList.remove("rem")
        prior()
        hasLeft = false;
    }
})
export async function drop({pos, id, html}) {
    const d = chap(id, html)
    switch (pos) {
        case 0: case-1:
            if (elem.childElementCount > 2) {
                elem.removeChild(elem.lastElementChild);
            }
            elem.prepend(d);
            dropObserve(d)
        break;
        case 1:
            if (elem.childElementCount > 2) {
                elem.removeChild(elem.firstElementChild);
            }
            elem.appendChild(d);
            addObserve(d)
        break;
        default:
            console.log("Invalid pos:", pos);
    }
}


/**
 * fn observe
 *  if last:
 *      ratio > lim
 *      do add
 * 
 * fn: add
 *  remove first child
 *  append child
 *  ev obseve
 * 
 * if rem
 *  remove last child
 *  prepend child
 *  
 */