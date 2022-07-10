import { className } from "./constants";
import type MaybeHTMLElement from "../types/MaybeHTMLElement"

/**
 * A singleton that tracks the current spoken and highlighted word by the narrator.
 */
export default class Word {
    static elem:Element;
    static parent:MaybeHTMLElement;
    static index = 0;
    
    static highlight(e:SpeechSynthesisEvent) {
        if (this.parent == null 
        || e.name != "word") return;

        if (this.elem instanceof HTMLElement)
            this.elem.classList.remove(className.word)

        if (this.index < this.parent.children.length) {
            let c = this.parent.children.item(this.index++)
            if (c) {
                this.elem = c;
            }
            this.elem.classList.add(className.word);
        }
    }

    static setIndex(n:number) {
        this.index = Math.max(n, 0)
    }

    static reset(p:MaybeHTMLElement = null) {
        this.index = 0;
        this.parent = p;
    }
}