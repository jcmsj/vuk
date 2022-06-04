import { className } from "./constants";

/**
 * A singleton that tracks the current spoken and highlighted word by the narrator.
 */
export class Word {
    static elem = null;
    static index = 0;

    /**
     * @param {SpeechSynthesisEvent} e
     * Note: 
     */
    static highlight(e) {
        if (e.name != "word") return;

        if (this.elem instanceof HTMLElement)
            this.elem.classList.remove(className.word)

        if (this.index < this.elem.parentElement.children.length) {
            this.elem = this.elem.parentElement.children.item(this.index++)
            this.elem.classList.add(className.word);
        }
    }

    static setIndex(n) {
        if (typeof n != "number")
            return

        this.index = n;
    }

    static reset() {
        this.index = 0;
    }
}