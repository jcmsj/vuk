import { ref } from "vue";
import { Transformer } from "./Transformer";
import { Word } from "./Word";
import { getSelectionText, isElementInViewport } from "/src/modules/helpers";
import { readAloud } from "./narrator";
import { className, validElems } from "./constants";
import {BookmarkController} from "../../modules/Bookmarks"
import { refocus } from "../../modules/helpers";
import {dummyAudio} from "../../modules/useMediaSession"
export const isReading = ref(false)    
let gElem = null

/**
 * @param {HTMLElement} lem 
 */
export function isReadable(lem) {
    return (lem instanceof HTMLElement) && validElems.RE.test(lem.tagName)
}

/**
 * @param {Event} e 
 */
export function identifySpeechTarget(e) {
    const elem = e.target;

    if (elem.isSameNode(gElem) 
    || !validElems.RE.test(elem.tagName)
    ) 
        return;

    //const wasReading = isReading.value;

    stopReading()
    setSpeechTarget(elem)
}

/**
 * @param {HTMLElement|null} chapterElem 
 * @returns {HTMLElement}
 */
function find(chapterElem) {
    if (chapterElem == null 
    || !chapterElem.classList.contains(className.chapter)) {
        
        throw TypeError("Not a chapter element");
    }
    
    if (chapterElem.innerText.length == 0)
        return find(chapterElem.nextElementSibling);

    let target = chapterElem.querySelector(validElems.selector);
    //todo: Traverse tree since the target may contain childs.
    
    return target;
}

/**
 * @param {HTMLElement} elem 
 * @returns success
 */
export function setSpeechTarget(elem) {
    if (isReadable(elem)) {
        Transformer.last = gElem;
        gElem = elem;

        console.log("R", gElem);
        return true;
    }

    if (elem && elem.tagName == "FOOTER")
        onBookEnd();

    return false
}

export async function startReading() {
    let txt = (gElem && gElem.innerText) || "";
    txt = txt.slice(txt.indexOf(getSelectionText()))

    if (beforeSpeak(txt)) {
        await dummyAudio.play()
        navigator.mediaSession.playbackState = "playing"
    } else {
        console.warn("No text to speak.");
    }
}

/**
 * @param {string} txt 
 * @returns Success
 */
function beforeSpeak(txt) {
    if (txt.length == 0) {
        //Todo: Add warning, since it may hint that there is an issue with 
        upnext(gElem)
        return false;
    }

    const {element , charIndex} = Transformer.transform(gElem, Word.index)
    gElem = element;
    txt = txt.slice(charIndex);
    //If cI is zero, then the narrator is going to speak new text. 
    if (charIndex == 0)
        Word.reset();

    if(!isElementInViewport(gElem))
        refocus(gElem);

    const utterance = readAloud(txt)

    const nextWord = e => {
        Word.highlight(e, gElem)
    }
    utterance.onstartReading = nextWord
    utterance.onboundary = nextWord

    utterance.onend = () => {
        upnext(gElem)
    };

    isReading.value = true;
    return true;
}

export async function stopReading() {
    if (!isReading.value)
        return

    speechSynthesis.cancel();
    isReading.value = false;
    dummyAudio.pause()
    navigator.mediaSession.playbackState = "paused"
    BookmarkController.saveProgress(gElem)
    Transformer.revert()

}

export function toggleReading() {
    isReading.value ? stopReading():startReading()
}

/**
 * @param {HTMLElement} target 
 */
function move(target) {
    if (!isReading.value) {
        return;
    }

    Word.reset();
    Transformer.revert();
    
    if (setSpeechTarget(target)) {
        beforeSpeak(target.innerText)
    } else {
        onBookEnd()
    }
}

/**
 * @param {HTMLElement} elem 
 * @param {string} property 
 */
function upnext(elem, property = "nextElementSibling") {
    let target = null
    while(target == null) {
        target = elem[property] 
            || null;
        elem = elem.parentElement
    }

    //When the element is empty, find next
    if (target.innerText.length == 0) 
        return upnext(target,property)

    if (target.classList instanceof DOMTokenList
    && target.classList.contains(className.chapter)
    )
        target = find(target);
    
    move(target);
}

function onBookEnd() {
    readAloud("There is no more text to read.")
    throw Error("End of Book!") //Force an error | Halting problem
    //TODO: do BookEndEvent
}

export function onBookLoaded() {
    const ch = document.querySelector("." + className.chapter);

    if (ch == null)
        return false;

    console.log("First chapter:", ch);
    setSpeechTarget(
        find(ch)
    )

    return true;
}