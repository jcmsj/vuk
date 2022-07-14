import { ref } from "vue";
import Transformer from "./Transformer";
import Word from "./Word";
import { getSelectionText, isElementInViewport } from "/src/modules/helpers";
import { className, validElems } from "./constants";
import {BookmarkController} from "../Bookmarks";
import {EnhancedEpub} from "../modules/EnhancedEpub"
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
 * @param {HTMLElement} elem 
 */
function isChapter(elem) {
    return elem && elem.className.includes(className.chapter)
}
/**
 * @param {HTMLElement|null} chapterElem 
 * @returns {HTMLElement}
 */
function find(chapterElem) {
    if (!isChapter(chapterElem)) {
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
        Transformer.last.set(gElem)
        gElem = elem;

        console.log("R", gElem);
        return true;
    }

    if (elem && elem.tagName == "FOOTER")
        onBookEnd();

    return false
}

export async function startReading() {
    let txt = (gElem?.innerText) || "";
    let index = txt.indexOf(getSelectionText())
    let offset = 0;
    if (index) {
        for (let i = index; i > 0; i--) {
            if (txt.charAt(i) == ' ') 
                offset++;
        }
    }
    txt = txt.slice(index)

    try {
        beforeSpeak(txt, offset)
    } catch(e) {
        onBookEnd()
        throw e;
    }
}

function scrollIfUnseen(gElem) {
    if (!isElementInViewport(gElem))
        refocus(gElem);
}
/**
 * @param {string} txt 
 * @returns Success
 */
function beforeSpeak(txt=gElem.innerText, startAT=0) {
    if (txt.length == 0) {
        //Todo: Add warning, since it may hint that there is an issue with 
        refocus(gElem)
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
    Word.setIndex(startAT)

    scrollIfUnseen(gElem)
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
 * Traverses the DOM sidewards or upwards to find the next element.
 */
function upnext(elem, property = "nextElementSibling") {
    let target = null
    do {
        target = elem[property] 
            || null;
        elem = elem.parentElement
    } while(target == null);

    //When there's no text, find next
    if (target.innerText.length == 0) 
        return upnext(target,property)
    if (isChapter(target))
        target = find(target);
    
    continueReading(target);
}

/**
 * @param {HTMLElement} target 
 * Resets the VFX of the text just spoken then continues speaking from the target element
 * To be called only by 'upnext'
 */
 function continueReading(target) {
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
    try {
        //Commented lines should work but no for some reason
        //Attempt 1: Force isReading to true then let upnext handle it
        isReading.value = true
        upnext(gElem) 
        
        
        /* let t = document.getElementById(EnhancedEpub.instance.id)
        t= find(t)
        setSpeechTarget(t)
        startReading() */
    } catch(e) {
        readAloud("There is no more text to read.")
        throw Error("End of Book!") //Force an error | Halting problem
    }
    //TODO: do BookEndEvent
}

export function reset() {
    stopReading()
    Word.reset()
    Transformer.last.set(null)
    gElem = null
}