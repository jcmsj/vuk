import { reactiveMap } from "./reactives";
import generateSelector from "./generateSelector"
import {get, set} from "idb-keyval"
export const Bookmarks = reactiveMap({
    className: "bookmark",
    charPreview: 20,
    /**
     * 
     * @param {HTMLElement} elem 
     */
    mark(elem, percentage=0) {
        const s = generateSelector(elem, document.querySelector("#app"))
        if (elem.classList.contains("bookmark")) {
            Bookmarks.unMark(s);
            return false;
        }

        let v = "";
        switch(elem.tagName) {
            case "IMG":
                v = elem.alt
                break;
            default:
                v = elem.innerText.slice(0, this.charPreview)
        }
        v+= " - "+ percentage + "%";

        elem.classList.add(this.className)
        Bookmarks.items.set(s, v);
        this.sync()
        return true
    },
    unMark(selector) {
        document.querySelector(selector).classList.remove(this.className)
        Bookmarks.items.delete(selector)
        this.sync()
    },
    async load() {
        const items = await get(`bookmark-${document.title}`)
        if (items instanceof Object ) {
            this.items = new Map(Object.entries(items))
        }
    },
    sync() {
        try {
            set(`bookmark-${document.title}`, Object.fromEntries(Bookmarks.items));
        } catch (e) {
            console.log(e);
        }
    },
    get(n) {
        let i = 0
        for (const pair of this.items) {
            if (n == i++) {
                return pair
            }
        }

        return null
    }
})