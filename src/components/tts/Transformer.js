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
     * @returns Object containing the char index to resume talking and the new value of the global elem.
     */
    static transform(elem, wordIndex) {
        const resumed = elem.isSameNode(this.last)

        this.last = elem;
        this.clone = elem.innerHTML;
        elem.classList.add(className.para)
        
        let charIndex = 0;
        const words = elem.innerText.split(' ');
        if (resumed) { //Find the absolute position
            for (let i = 0; i < wordIndex; i++) {
                charIndex += words[i].length + 1; //offset +1 for the space
            }
        }

        //Actual transformation
        elem.innerHTML = words
            .map(w =>`<span>${w}</span>`)
            .join(' ');
        
        return {element:elem, charIndex};
    }

    static revert() {
        if (!(this.last instanceof HTMLElement)) return;
        this.last.innerHTML = this.clone
        this.last.classList.remove(className.para)
    }
}