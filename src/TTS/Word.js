import { className } from "./constants";

/**
 * A singleton that tracks the current spoken and highlighted word by the narrator.
 */
export default class Word {
    static elem = null;
    static parent = null;
    static index = 0;

    /**
     * @param {SpeechSynthesisEvent} e
     */
    static highlight(e) {
        if (this.parent && e.name != "word") return;

        if (this.elem instanceof HTMLElement)
            this.elem.classList.remove(className.word)

        if (this.index < this.parent.children.length) {
            this.elem = this.parent.children.item(this.index++)
            this.elem.classList.add(className.word);
        }
    }

    /**
     * @param {Number} n 
     */
    static setIndex(n) {
        this.index = n || 0
    }

    static reset(p = null) {
        this.index = 0;
        this.parent = p;
    }
}