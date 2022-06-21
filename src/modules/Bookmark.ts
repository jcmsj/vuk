
import generateSelector from "./generateSelector"
import { getReadingProgress } from "./useMainElem";

export class Bookmark {
    selector: String;
    text: String;
    percentage: number;
    static charPreview = 20;

    constructor(selector:String, text:String, percentage:number=0) {
        this.selector = selector;
        text.replace('"', "\"")
        this.text = text;
        this.percentage = percentage;
    }

    toString() {
        return `${this.text} - ${this.percentage}%`
    }

    toJSON() {
        return `{"selector":"${this.selector}","text":"${this.text}","percentage":${this.percentage}}`
    }

    toObject() {
        return {
            selector: this.selector,
            text : this.text,
            percentage: this.percentage
        }
    }
    static from(elem) {
        const reap = () =>  {
            switch(elem.tagName) {
                case "IMG":
                    return elem.alt
                default:
                    return elem.innerText.slice(0, Bookmark.charPreview)
            }
        }

        return new Bookmark(
            generateSelector(elem, document.querySelector("#app")),
            reap(),
            getReadingProgress()
        )
    }

    static fromJSON(str:string) {
        const o = JSON.parse(str)
        return this.fromObject(o)
    }

    static fromObject(o) {
        return new Bookmark(o.selector, o.text, o.percentage);
    }
}