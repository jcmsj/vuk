import {className} from "./constants"
import Aspect from "../types/Aspect";

/**
 * A singleton that transforms the words in a readable element into span tags that can be indexed.
 */
export default class Transformer {
    static clone = "";
    public static last = new Aspect();

    /**
     * @param {HTMLElement} elem a readable element
     * @param {Number} wordIndex last word read by TTS. It is >= 0 
     * @returns char index to resume speaking.
     */
    static transform(elem:HTMLElement, wordIndex:Number) {
        const resumed = this.last.map<boolean>((l:Element)=>l.isSameNode(elem)).unwrapOr(false)

        this.last.set(elem);
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
            .map((w:string) =>`<span>${w}</span>`)
            .join(' ');
        
        return charIndex;
    }

    static revert() {
        this.last.map((l:HTMLElement) => {
            l.innerHTML = this.clone
            l.classList.remove(className.para)
        })
    }
}