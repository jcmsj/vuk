import { ref } from "vue";
import Transformer from "./Transformer";
import Word from "./Word";
import { getSelectionText, isElementInViewport } from "/src/modules/helpers";
import { className, validElems } from "./constants";
import {BookmarkController} from "../Bookmarks";
import { refocus } from "../modules/helpers";
import voice from "./voice";
import speech_rate from "./speech_rate";
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
        
        throw TypeError("Not a chapter element:", chapterElem);
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

/**
 * @param {HTMLElement} elem 
 */
function spotTarget(elem) {
    return setSpeechTarget(
        find(
            elem
        )
    )
}
export async function startReading() {
    let txt = (gElem && gElem.innerText) || "";
    txt = txt.slice(txt.indexOf(getSelectionText()))

    try {
        beforeSpeak(txt)
    } catch(e) {
        console.log(e);
    }
}

/**
 * @param {string} txt 
 * @returns Success
 */
function beforeSpeak(txt=gElem.innerText) {
    if (txt.length == 0) {
        //Todo: Add warning, since it may hint that there is an issue with 
        upnext(gElem)
        return false;
    }

    const charIndex = Transformer.transform(gElem, Word.index)
    if (charIndex) {
        txt = txt.slice(charIndex);
    } else {
        //The narrator is going to speak new text. 
        Word.reset(gElem);
    }

    if(!isElementInViewport(gElem))
        refocus(gElem);

    readAloud(txt)
    return true;
}

/**
 * @param {string} txt 
 */
function readAloud(txt) {
    const utt = new SpeechSynthesisUtterance(txt)
    utt.onboundary 
    = utt.onstart 
    = Word.highlight.bind(Word);
    utt.onend = () => upnext(gElem);
    utt.rate = speech_rate.value

    if (voice.value!= null)
        utt.voice = voice.value;

    speechSynthesis.speak(utt);
    isReading.value = true;
}

export function stopReading() {
    if (!isReading.value)
        return

    speechSynthesis.cancel();
    isReading.value = false;
    BookmarkController.saveProgress(gElem)
    Transformer.revert()
}

export function toggleReading() {
    isReading.value ? stopReading():startReading()
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

/**
 * @param {HTMLElement} target 
 * Moves the visual indicator of the text being spoken.
 */
 function move(target) {
    if (!isReading.value) {
        return;
    }

    Word.reset();
    Transformer.revert();
    
    if (setSpeechTarget(target)) {
        beforeSpeak()
    } else {
        onBookEnd()
    }
}

async function onBookEnd() {
    readAloud("There is no more text to read.")
}

export function onBookLoaded() {
    const maybeChapter = document.querySelector("." + className.chapter)
    if (spotTarget(maybeChapter)) {
        console.log("First chapter:", maybeChapter);
        return true
    }

    return false
}

export function reset() {
    stopReading()
    Word.reset()
    Transformer.last = null
    gElem = null
}