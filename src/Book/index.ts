
import {EnhancedEpub} from "../lib/EnhancedEpub";
import {refocus} from "../lib/helpers"
import BookmarkController from "../Bookmarks/BookmarkController"
import { LoadMethod, loadMethod } from "../Library/Load";
import { setWalker } from "v-walker/index";
import { narrator } from "../TTS/Narrator";
import { view, pages, next, prev} from "./Pages";

const options = {
    root: null,
    rootMargin: "0px",
    threshold : 0.9
}

const addObserver = new IntersectionObserver(([entry], obs) => {
    if (entry.isIntersecting) {
        entry.target.classList.remove("add")
        add()
    }
}, options)

const dropObserver = new IntersectionObserver(([entry], obs) => {
    if (entry.isIntersecting) {
        entry.target.classList.remove("rem", "hasleft")
        prior()
    }
}, options)

export function clearChilds(lem:HTMLElement) {
    while(lem?.firstElementChild)
        lem.firstElementChild.remove();
}

export async function unobserve() {
    if (!(next.value && prev.value)) {
        throw TypeError("One or more observer elements ('next' or 'prev') are absent");
    }

    //Temporarily disable navigation when loading.
    if (loadMethod.value == LoadMethod.lazy) {
        addObserver.unobserve(next.value)
        dropObserver.unobserve(prev.value)
    }
}

export async function observe(fresh=true) {
    if (!view.value)
        return;

    if (loadMethod.value == LoadMethod.lazy) {
        addObserver.observe(next.value!)
        dropObserver.observe(prev.value!)
    }

    if(fresh) {
        reassign()
    }
}

export async function reassign() {
    if (!view.value) return;

    if (view.value.childElementCount == 3)
    refocus(view.value.firstElementChild?.nextElementSibling!);
    setWalker(view.value);
    const maybeLatest = await BookmarkController.reapply()
    if (maybeLatest) {
        narrator.override(maybeLatest.elem);
        refocus(maybeLatest.elem)
    }
}
export async function repaint(paintables = []) {
    pages.value = paintables;
}

function add() {
    try {
        EnhancedEpub.instance?.next();
    } catch(e) {
        console.log("Possibly end of book", e);
    }
}

function prior() {
    try {
        EnhancedEpub.instance?.previous();
    } catch(e) {
        console.log("Possibly start of book", e);
    }
}

export async function drop(p) {
    const elem = view.value!
    const _pages = pages.value;
    switch (p.pos) {
        case -1:
            if (elem.childElementCount > 2) {
                _pages.pop()
            }
            elem.firstElementChild?.scrollIntoView({ block: "nearest", behavior: "smooth" })
            _pages.unshift(p)
        break;
        case 1:
            if (elem.childElementCount > 2) {
                _pages.shift()
            }
            _pages.push(p)
        break;
        default:
            console.log("Invalid pos:", p.pos);
    }
}