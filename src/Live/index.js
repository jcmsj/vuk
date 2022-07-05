import {ref} from "vue"
import {className} from "../TTS/constants"
import { BookmarkController } from "../Bookmarks"
import { onBookLoaded } from "../TTS"
export const live = ref()

/**
 * @param {HTMLElement} lem 
 */
 export function clearChilds(lem) {
    while(lem.firstElementChild)
        lem.firstElementChild.remove();
}

function chap({id, html}) {
    const d = document.createElement("div")
    d.id = id
    d.innerHTML = html
    d.className = className.chapter
    return d;
}

export function reset() {
    clearChilds(live.value)
}

export function paint(paintable) {
    live.value.appendChild(chap(paintable))
}

export function onEnd() {
    if (BookmarkController.reapply()) {
        onBookLoaded();
    }
}