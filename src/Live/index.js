
import {ref} from "vue"
import {EnhancedEpub} from "../modules/EnhancedEpub";
import {refocus} from "../modules/helpers"
import { className } from "../TTS/constants";
import BookmarkController from "../Bookmarks/BookmarkController"
import { LoadMethod, loadMethod } from "../Library/Load";
import { ChapterWalker } from "../TTS/walker";
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

export function setLive(id) {
    elem = document.getElementById(id);
}

function chap({id, html}) {
    const d = document.createElement("div")
    d.id = id
    d.innerHTML = html
    d.className = className.chapter
    return d;
}
/**
 * @param {HTMLElement} lem 
 */
export function clearChilds(lem) {
    while(lem.firstElementChild)
        lem.firstElementChild.remove();
}
export function repaint(paintables = []) {

    if (elem == null) {
        throw TypeError("No 'view' element")
    }

    if (!(next.value ?? prev.value)) {
        throw TypeError("One or more observer elements ('next' or 'prev') are absent");
    }
    //Temporarily disable navigation when loading.
    const isLazyLoaded = loadMethod.value == LoadMethod.lazy
    if (isLazyLoaded) {
        addObserver.unobserve(next.value)
        dropObserver.unobserve(prev.value)
    }

    clearChilds(elem);
    
    elem.append(...paintables.map(chap))

    if (isLazyLoaded) {
        addObserver.observe(next.value)
        dropObserver.observe(prev.value)
    }

    if (elem.childElementCount == 3)
        refocus(elem.firstElementChild.nextElementSibling);
    
    const _ = new ChapterWalker(elem);
    BookmarkController.reapply()
}

function add() {
    try {
        EnhancedEpub.instance.next();
    } catch(e) {
        console.log("Possibly end of book", e);
    }
}

function prior() {
    try {
        EnhancedEpub.instance.previous();
    } catch(e) {
        console.log("Possibly start of book", e);
    }
}

export async function drop(p) {
    const d = chap(p)
    switch (p.pos) {
        case -1:
            if (elem.childElementCount > 2) {
                elem.lastElementChild.remove()
            }
            elem.firstElementChild
            .scrollIntoView({ block: "nearest", behavior: "smooth" })
            elem.prepend(d);
        break;
        case 1:
            if (elem.childElementCount > 2) {
                elem.firstElementChild.remove()
            }
            elem.appendChild(d);
            refocus(d)
        break;
        default:
            console.log("Invalid pos:", p.pos);
    }
}