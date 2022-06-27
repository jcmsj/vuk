
import EnhancedEpub from "../modules/EnhancedEpub";
import {ref} from "vue"
import {refocus} from "../modules/helpers"
import { className } from "./tts/constants";
export const prev = ref();
export const next = ref();
var hasLeft = false;
var elem = null;

let addObserver, dropObserver;

export function setView(id) {
    elem = document.getElementById(id)
    addObserver = new IntersectionObserver(([entry], obs) => {
        if (entry.isIntersecting) {
            entry.target.classList.remove("add")
            addObserver.unobserve(entry.target)
            add()
        }
    }, options)
    
    dropObserver = new IntersectionObserver(([entry], obs) => {
    
        if (hasLeft == false && entry.isIntersecting == false) {
                hasLeft = true;
                entry.target.classList.add("hasleft")
        } else if (hasLeft && entry.isIntersecting) {
            dropObserver.unobserve(entry.target)
            entry.target.classList.remove("rem", "hasleft")
            prior()
            hasLeft = false;
        }
    }, options)
}

const options = {
    root: null,
    rootMargin: "0px",
    threshold : 0.1
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
    if (elem.childElementCount >=3) {
        dropObserve(elem.firstElementChild)
        refocus(elem.firstElementChild.nextElementSibling)
    }
}

function add() {
    try {
        EnhancedEpub.instance.next();
    } catch(e) {
        console.log("Possibly end of book", [e]);
    }
}
function prior() {
    try {
        EnhancedEpub.instance.previous();
    } catch(e) {
        console.log("Possibly start of book", [e]);
    }
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
    hasLeft = false
    lem.classList.add("rem")
    console.log(lem);
    dropObserver.observe(lem)
}

export async function drop({pos, id, html}) {
    const d = chap(id, html)
    switch (pos) {
        case -1:
            if (elem.childElementCount > 2) {
                addObserver.unobserve(elem.lastElementChild)
                elem.removeChild(elem.lastElementChild);
            }
            elem.firstElementChild.scrollIntoView({block:"end"})
            elem.prepend(d);
            dropObserve(d)
            addObserve(elem.lastElementChild)
        break;
        case 1:
            if (elem.childElementCount > 2) {
                dropObserver.unobserve(elem.firstElementChild)
                elem.removeChild(elem.firstElementChild);
            }
            refocus(elem.lastElementChild)
            elem.appendChild(d);
            addObserve(d)
            dropObserve(elem.firstElementChild)
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