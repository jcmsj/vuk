import {ref} from "vue";
import { className, validElems } from "./constants";
import { getSelectionText, isElementInViewport } from "./helpers";
import { Transformer } from "./Transformer";
import { Word } from "./Word";
import { readAloud } from "./narrator";
//Globals
var gElement = null

export const isReading = ref(false);
export function identifySpeechTarget(e) {
    const elem = e.target;

    if (elem.isSameNode(gElement) || !validElems.RE.test(elem.tagName)) return;

    const wasReading = isReading.value;
    stopReading()
    setSpeechTarget(elem)

    /**
     * Todo: When clicked on another element while reading, move speechcursor to that.
     * Disabled for now due to conflict with utterance.onend
     */
    /* if (wasReading)
        startReading(); */
}

/**
 * @param {HTMLElement} elem 
 */
export function setSpeechTarget(elem) {
    if (!(elem instanceof HTMLElement)
    || !validElems.RE.test(elem.tagName)) {
        console.warn("Invalid speech target:", elem);
        return false
    }

    Transformer.last = gElement;

    gElement = elem;
    console.log("R", gElement);
    return true;
}

export function onBookLoaded() {
    const ch = document.querySelector("." + className.chapter);

    if (ch == null) {
        setTimeout(onBookLoaded, 500)
        return
    }
    console.log(ch);
            
    setSpeechTarget(
        findFirstReadable(ch)
    )
}

export function startReading() {
    if (!(gElement instanceof HTMLElement)) return
    
    //Start reading at the selected text
    let txt = gElement.innerText;
    txt = txt.slice(txt.indexOf(getSelectionText()))

    beforeSpeak(txt);
}

function moveSpeechCursor(target) {
    if (!isReading.value) {
        console.warn("Not in reading state");
        return;
    }

    Word.reset();
    Transformer.revert();

    setSpeechTarget(target);

    if (!beforeSpeak(target.innerText)) {
        moveSpeechCursor(nextReadable(target))
    }
}

/**
 * 
 * @param {String} txt 
 */
function beforeSpeak(txt = "") {
    if (txt.length == 0) {
        //Todo: Add warning, since it may hint that there is an issue with IdentifySpeechTarget
        return false;
    }
    
    const {element , charIndex} = Transformer.transform(gElement, Word.index)
    gElement = element;
    txt = txt.slice(charIndex);
    //If cI is zero, then the narrator is going to speak new text. 
    if (charIndex == 0) {
        Word.reset()
    }

    if(!isElementInViewport(gElement))
        gElement.scrollIntoView({block:"start"});

    const utterance = readAloud(txt)
    utterance.onstart = e => {
        Word.highlight(e, gElement)
    }
    utterance.onboundary = e => {
        Word.highlight(e, gElement)
    }
    utterance.onend = (e) => {
        if (isReading.value)
            moveSpeechCursor(nextReadable(gElement));
    };

    isReading.value = true;

    return true;
}

function nextReadable(elem, property = "nextElementSibling") {
    let target = null
    while(target == null) {
        target = elem[property] 
            || null;
        elem = elem.parentElement
    }

    //When the element is empty, find next
    if (target.innerText.length == 0) 
        return nextReadable(target,property)

    if (target.classList instanceof DOMTokenList
        && target.classList.contains(className.chapter)
    )
        target = findFirstReadable(target);
    
    return target;
}

function endOfBookReached() {
    console.warn("End of Book has been reached!")
}

/**
 * @param {HTMLElement} chapterElem 
 */
function findFirstReadable(chapterElem) {
    if (chapterElem == null 
    || !chapterElem.classList.contains(className.chapter)) {
        console.warn("Not a chapter element");
        return
    }

    if (chapterElem.innerText.length == 0)
        return findFirstReadable(chapterElem.nextElementSibling)

    let target = chapterElem.querySelector(validElems.selector);
    //todo: Traverse tree since the target may contain childs.
    
    return target;
}

export function toggleReading() {
    isReading.value ? stopReading():startReading();
}

export function stopReading() {
    if (isReading.value == false) return;
    speechSynthesis.cancel();
    isReading.value = false;
    Transformer.revert();
}