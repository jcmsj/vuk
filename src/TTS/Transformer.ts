import {className} from "./constants"

/**
 * A singleton that transforms the words in a readable element into span tags that can be indexed.
 */
export default class Transformer {
    private static clone = "";
    private static words:string[]; //For Memoization
    public static last:HTMLElement|null;

    /**
     * @param {HTMLElement} elem a readable element
     * @param {Number} wordIndex last word read by TTS. It is >= 0 
     * @returns char index to resume speaking.
     */
    static transform(elem:HTMLElement, wordIndex:Number) {
        const resumed = elem.isSameNode(this.last)

        this.last=elem;

        let charIndex = 0;
        if (resumed) { //Find the absolute position
            for (let i = 0; i < wordIndex; i++) {
                charIndex += this.words[i].length + 1; //offset +1 for the space
            }
        } else {
            //Actual transformation
            this.words = elem.innerText.split(' ');
            this.clone = elem.innerHTML;
            elem.classList.add(className.para)

            elem.innerHTML = this.words
            .reduce((html, word) => html + `<span>${word} </span>`, "");
        }
        
        return charIndex;
    }

    static revert() {
        if (this.last instanceof HTMLElement) {
            this.last.innerHTML = this.clone
            this.last.classList.remove(className.para)
        }
    }
}