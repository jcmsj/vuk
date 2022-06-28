
import EnhancedEpub from "../modules/EnhancedEpub";
import {ref} from "vue"
import {refocus} from "../modules/helpers"
import { className } from "./tts/constants";

export const prev = ref();
export const next = ref();
var elem = null;
const options = {
    root: null,
    rootMargin: "0px",
    threshold : 0.9
}

let addObserver = new IntersectionObserver(([entry], obs) => {
    if (entry.isIntersecting) {
        entry.target.classList.remove("add")
        add()
    }
}, options)

let dropObserver = new IntersectionObserver(([entry], obs) => {
    if (entry.isIntersecting) {
        entry.target.classList.remove("rem", "hasleft")
        prior()
    }
}, options)

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

    addObserver.observe(next.value)
    dropObserver.observe(prev.value)
    if (elem.childElementCount == 3)
        refocus(elem.firstElementChild.nextElementSibling);
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

export async function drop({pos, id, html}) {
    const d = chap(id, html)
    switch (pos) {
        case -1:
            if (elem.childElementCount > 2) {
                elem.removeChild(elem.lastElementChild);
            }
            elem.prepend(d);
            d.scrollIntoView({block:"end", behavior:"smooth"})
        break;
        case 1:
            if (elem.childElementCount > 2) {
                elem.removeChild(elem.firstElementChild);
            }
            elem.appendChild(d);
            refocus(d)
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