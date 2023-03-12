
import {instance, LoadedChapter} from "../lib/EnhancedEpub";
import {refocus} from "../lib/helpers"
import { LoadMethod, loadMethod } from "../Library/Load";
import { setWalker } from "v-walker/index";
import { narrator } from "../TTS/Narrator";
import { view, pages, next, prev} from "./Pages";
import { useLocalStorage } from "@vueuse/core";
import { reapply } from "src/Bookmarks/useBook";

const options = {
    root: null,
    rootMargin: "0px",
    threshold : 0.9
}

const addObserver = new IntersectionObserver(([entry], _) => {
    if (entry.isIntersecting) {
        entry.target.classList.remove("add")
        instance?.next()
    }
}, options)

const dropObserver = new IntersectionObserver(([entry], _) => {
    if (entry.isIntersecting) {
        entry.target.classList.remove("rem", "hasleft")
        instance?.previous()
    }
}, options)

export function clearChilds(lem:HTMLElement) {
    while(lem?.firstElementChild)
        lem.firstElementChild.remove();
}

/**
 * Disables Chapter loaders
 */
export async function unobserve() {
    if (!(next.value && prev.value)) {
        throw TypeError("One or more observer elements ('next' or 'prev') are absent");
    }

    addObserver.unobserve(next.value)
    dropObserver.unobserve(prev.value)
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

    if (view.value.childElementCount == 3) {
            refocus(view.value.firstElementChild?.nextElementSibling!)
    }
    
    setWalker(view.value);
    const maybeLatest = await reapply()
    if (maybeLatest) {
        narrator.override(maybeLatest.elem);
        refocus(maybeLatest.elem)
    }
}
export async function repaint(paintables:LoadedChapter[] = []) {
    pages.value = paintables;
}

export interface Page extends LoadedChapter {
    pos:LoadPosition
}

export enum LoadPosition {
    before=-1,
    after=1
}

const ShiftCount = useLocalStorage("shift-count",2)

export async function render(p:Page ) {
    const _pages = pages.value;
    switch (p.pos) {
        case -1:
            if (_pages.length > ShiftCount.value) {
                _pages.pop()
            }
            view.value!.firstElementChild?.scrollIntoView({ block: "nearest", behavior: "smooth" })
            _pages.unshift(p)
        break;
        case 1:
            if (_pages.length > ShiftCount.value) {
                _pages.shift()
            }
            _pages.push(p)
        break;
        default:
            console.log("Invalid pos:", p.pos);
    }
}