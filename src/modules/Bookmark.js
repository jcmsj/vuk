import { reactiveMap } from "./reactives";
import generateSelector from "./generateSelector"

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
        return true
    },
    unMark(selector) {
        document.querySelector(selector).classList.remove(this.className)
        Bookmarks.items.delete(selector)
    }
})