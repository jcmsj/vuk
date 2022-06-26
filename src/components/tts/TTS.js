import { ref } from "vue";
import { Transformer } from "./Transformer";
import { Word } from "./Word";
import { getSelectionText, isElementInViewport } from "/src/modules/helpers";
import { readAloud } from "./narrator";
import { className, validElems } from "./constants";

/**
 * @param {HTMLElement} lem 
 */
 export function isReadable(lem) {
    return (lem instanceof HTMLElement) && validElems.RE.test(lem.tagName)
}

class Reader {
    isReading = ref(false)
    elem = null
    
    /**
     * @param {Event} e 
     */
    identify(e) {
        const elem = e.target;

        if (elem.isSameNode(this.elem) 
        || !validElems.RE.test(elem.tagName)
        ) 
            return;
    
        //const wasReading = isReading.value;
    
        this.stop()
        this.set(elem)
    }

    /**
     * @param {HTMLElement|null} chapterElem 
     * @returns {HTMLElement}
     */
    find(chapterElem) {
        if (chapterElem == null 
        || !chapterElem.classList.contains(className.chapter)) {
            
            throw TypeError("Not a chapter element");
        }
        
        if (chapterElem.innerText.length == 0)
            return this.find(chapterElem.nextElementSibling)
    
        let target = chapterElem.querySelector(validElems.selector);
        //todo: Traverse tree since the target may contain childs.
        
        return target;
    }

    /**
     * @param {HTMLElement} elem 
     * @returns success
     */
    set(elem) {
        if (isReadable(elem)) {
            Transformer.last = this.elem;
            this.elem = elem;
            console.log("R", this.elem);
            return true;
        }

        if (elem && elem.tagName == "FOOTER")
            onChapterEnd()
        else
            console.log("Invalid speech target:", elem);

        return false
    }

    start() {
        let txt = (this.elem && this.elem.innerText) || "";
        txt = txt.slice(txt.indexOf(getSelectionText()))

        if (!this.beforeSpeak(txt))
            console.warn("No text to speak.");
    }
    
    /**
     * @param {string} txt 
     * @returns Success
     */
    beforeSpeak(txt) {
        if (txt.length == 0) {
            //Todo: Add warning, since it may hint that there is an issue with Identify
            this.upnext(this.elem)
            return false;
        }

        const {element , charIndex} = Transformer.transform(this.elem, Word.index)
        this.elem = element;
        txt = txt.slice(charIndex);
        //If cI is zero, then the narrator is going to speak new text. 
        if (charIndex == 0) {
            Word.reset()
        }
    
        if(!isElementInViewport(this.elem))
            this.elem.scrollIntoView({block:"start"});
    
        const utterance = readAloud(txt)

        const nextWord = e => {
            Word.highlight(e, this.elem)
        }
        utterance.onstart = nextWord
        utterance.onboundary = nextWord

        utterance.onend = (e) => {
            this.upnext(this.elem)
        };
    
        this.isReading.value = true;
        return true;
    }

    stop() {
        if (!this.isReading.value)
        return

        speechSynthesis.cancel();
        this.isReading.value = false;
        Transformer.revert()
    }

    toggle() {
        this.isReading.value ? this.stop():this.start()
    }

    /**
     * @param {HTMLElement} target 
     */
    move(target) {
        if (!this.isReading.value) {
            return;
        }
    
        Word.reset();
        Transformer.revert();
    
        this.set(target);
    
        this.beforeSpeak(target.innerText)
    }

    /**
     * @param {HTMLElement} elem 
     * @param {string} property 
     */
    upnext(elem, property = "nextElementSibling") {
        let target = null
        while(target == null) {
            target = elem[property] 
                || null;
            elem = elem.parentElement
        }

        //When the element is empty, find next
        if (target.innerText.length == 0) 
            return this.upnext(target,property)

        if (target.classList instanceof DOMTokenList
        && target.classList.contains(className.chapter)
        )
            target = this.find(target);
        
        this.move(target);
    }

    onChapterEnd() {
        throw Error("End of Chapter|Book!")
        //TODO: Load next chapter of do BookEndEvent
    }
}
export const reader = new Reader();

export function onChapterLoaded() {
    const ch = document.querySelector("." + className.chapter);

    if (ch == null)
        return

    console.log("First chapter:", ch);
    reader.set(
        reader.find(ch)
    )
}