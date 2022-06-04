import {className} from "./constants"

/**
 * A singleton that transforms the words in a readable element into span tags that can be indexed.
 */
export class Transformer {
    static clone = null;
    static last = null;

    /**
     * @param {HTMLElement} element a readable element
     * @param {Number} index last word read by TTS 
     * @returns Object containing the absolute index to resume talking and the new value of the global elem.
     */
    static transform(elem, index) {
        const resumed = elem.isSameNode(this.last)

        this.last = elem;
        this.clone = elem.innerHTML;
        elem.classList.add(className.para)
        
        let read = ""
        const words = elem.innerText.split(" ");

        if (resumed) { //Find the absolute position
            for (let i = 0; i < index; i++) {
                read += words[i] + " ";
            }
        } else
            index = 0;

        //Actual transformation
        elem.innerHTML = words
            .map(w =>`<span>${w}</span>`)
            .join(' ');
        
        return {element:elem, index:read.length};
    }

    static revert() {
        if (!(this.last instanceof HTMLElement)) return;
        this.last.innerHTML = this.clone
        this.last.classList.remove(className.para)
    }
}