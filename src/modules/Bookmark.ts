
import generateSelector from "./generateSelector"
import { getReadingProgress } from "./useMainElem";

export class Bookmark {
    static charPreview = 20;

    static create(selector:string, text:string, percentage:number = 0) {
        return {
            selector,
            text : text.replace('"', "\""),
            percentage
        }
    }

    static from(elem, percentage = getReadingProgress()) {
        const reap = () =>  {
            switch(elem.tagName) {
                case "IMG":
                    return elem.alt
                default:
                    return elem.innerText.slice(0, Bookmark.charPreview)
            }
        }
        return Bookmark.create(
            generateSelector(elem, document.querySelector("#app")),
            reap(),
            percentage
        )
    }

    static clone(proxy) {
        return this.create(proxy.selector, proxy.text, proxy.percentage);
    }
}