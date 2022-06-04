import {ref} from "vue";
import { speech_rate } from "./speech_rate";
import { voice } from "./voice";
import { getSelectionText, isElementInViewport } from "./helpers";
const className = {
    para: "s-read",
    word: "current-word",
    overlay : "overlay",
    chapter : "chapter"
}

const validElems = {
    selector : "h1, h2, h3, h4, h5, h6, a, p, div, span",
    RE : /^(P|A|H[1-6]|SPAN|DIV)$/
}

var gElement = null
var wordIndex = 0;
var wordElem = null;
var lastSelectedText = "";

export const isReading = ref(false);
export function identifySpeechTarget(e) {
    const [elem] = e.path.filter(elem => validElems.RE.test(elem.tagName))

    if (!elem || elem.isSameNode(gElement)) return;

    const wasReading = isReading.value;
    stopReading()
    setSpeechTarget(elem)
    if (wasReading)
        startReading();
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
    if (gElement == null) return
    
    //Start reading at the selected text
    let txt = gElement.innerText;
    txt = txt.slice(txt.indexOf(getSelectionText()))

    beforeSpeak((txt == lastSelectedText) 
        ? "": txt
    );
}

function moveSpeechCursor(target) {
    if (!isReading.value) {
        console.warn("Not in reading state");
        return;
    }

    wordIndex = 0;
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
        txt = lastSelectedText
        return false;
    } else {
        lastSelectedText = txt;
    }
    
    const alreadyRead = Transformer.transform()
    if (alreadyRead > 0)
        txt = txt.slice(alreadyRead);

    const utterance = readAloud(txt)
    utterance.onstart = highlightWord
    utterance.onboundary = highlightWord
    utterance.onend = (e) => {
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
 * 
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

/**
 * @param {string} txt 
 * @param {Function} cb 
 * @returns SpeechSynthesisUtterance
 */
function readAloud(txt) {
    const utterance = new SpeechSynthesisUtterance(txt)
    utterance.rate = speech_rate.value

    if (voice.value!= null )
        utterance.voice = voice.value;

    speechSynthesis.speak(utterance);
    return utterance;
}

/**
 * @param {SpeechSynthesisEvent} e
 * @returns 
 */
function highlightWord(e) {
    if (e.name != "word") return;

    if (wordElem instanceof HTMLElement)
        wordElem.classList.remove(className.word)

    if (wordIndex < gElement.children.length) {
        wordElem = gElement.children.item(wordIndex++)
        wordElem.classList.add(className.word);
    }
}

class Transformer {
    clone = null;
    last = null;
    static transform() {
        let resumed = gElement.isSameNode(this.last)

        this.last = gElement;
        this.clone = gElement.innerHTML;
        gElement.classList.add(className.para)
        
        let read = ""
        const words = gElement.innerText.split(" ");

        if (resumed) {
            for (let i = 0; i < wordIndex; i++) {
                read += words[i] + " ";
            }
        } else 
            wordIndex = 0;

        gElement.innerHTML =
            words
            .map(word =>
                `<span>${word}</span>`
            )
            .join(' ');
            
        if(!isElementInViewport(gElement))
            gElement.scrollIntoView({block:"start"});

        return read.length;
    }

    static revert() {
        if (!(this.last instanceof HTMLElement)) return;
        this.last.innerHTML = this.clone
        this.last.classList.remove(className.para)
    }
}

export function stopReading() {
    if (isReading.value == false) return;
    speechSynthesis.cancel();
    isReading.value = false;
    Transformer.revert();
}