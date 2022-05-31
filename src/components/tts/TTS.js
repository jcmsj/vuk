import {ref, reactive} from "vue";
import {get, set} from "idb-keyval";
import { idb } from "../idb";
const className = {
    para: "s-read",
    word: "current-word",
    overlay : "overlay",
    chapter : "chapter"
}

const allowedTagsSelector = "h1, h2, h3, h4, h5, h6, a, p, div, span";
export const allowedTags = /^(P|A|H[1-6]|SPAN)$/;
var elem = null
var wordIndex = 0;
var wordElem = null;
var lastSelectedText = "";
export const speech_overlay = reactive({
    clone: "",
    stats : {}
});
export const voice = reactive({
    value : null,
    set(name) {
        this.value = speechSynthesis
            .getVoices()
            .find(v => v.name == name)
            || null
    }
});

export const speech_rate = reactive({
    value : 1,
    min : 0.25,
    max : 3,

    /**
     * @param {Number} n 
     * @returns 
     */
    set(n) {
        if (n > this.max || n < this.min)
            return;

        this.value = n;
        set(idb.speech_rate, this.value);
    }
})

get(idb.speech_rate).then(n => {
    speech_rate.set(n || 1);
})

export const isReading = ref(false);
export function identifySpeechTarget(e) {
    const [_elem] = e.path.filter(_elem => allowedTags.test(_elem.tagName))

    if (!_elem || _elem.isSameNode(elem)) return;

    const wasReading = isReading.value;
    stopReading()
    setSpeechTarget(_elem)
    if (wasReading)
        startReading();
}

/**
 * https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text * 
 * @returns String
 */
 export function getSelectionText() {
    let text = "";
    if (window.getSelection)
        text = window.getSelection().toString();
    else if (document.selection && document.selection.type != "Control")
        text = document.selection.createRange().text;

    return text;
}

/**
 * https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport
 * @param {HTMLElement} el 
 * @returns boolean
 */
function isElementInViewport (el) {

    const rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && 
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
/**
 * @param {HTMLElement} _elem 
 */
export function setSpeechTarget(_elem) {
    if (!(_elem instanceof HTMLElement)
    || !allowedTags.test(_elem.tagName)) {
        console.warn("Invalid speech target:", _elem);
        return false
    }

    Transformer.last = elem;
    elem = _elem;
    console.log("R", elem);
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
    if (elem == null) return
    
    //Start reading at the selected text
    let txt = elem.innerText;
    txt = txt.slice(txt.indexOf(getSelectionText()))

    beforeSpeak((txt == lastSelectedText) 
        ? "": txt
    );
}

function moveSpeechCursor(target) {
    if (!isReading.value)
        return;

    wordIndex = 0;
    Transformer.revert();
    if (!isReading.value) return;

    setSpeechTarget(target);
    try {
        beforeSpeak(target.innerText);
    }
    catch(e) {
        console.log(target);
    }
}

/**
 * 
 * @param {String} txt 
 */
function beforeSpeak(txt = "") {
    if (txt.length == 0) {
        txt = lastSelectedText
    } else
        lastSelectedText = txt;
    
    const alreadyRead = Transformer.transform()
    if (alreadyRead > 0)
        txt = txt.slice(alreadyRead);

    const utterance = readAloud(txt)
    //speech_overlay.clone = elem.outerHTML;
    utterance.onstart = highlightWord
    utterance.onboundary = highlightWord
    utterance.onend = (e) => {
        moveSpeechCursor(nextReadable(elem));
    };
    isReading.value = true;
}

function nextReadable(element, property = "nextElementSibling") {
    let target = null
    while(target == null) {
        target = element[property] 
            || null;
        element = element.parentElement
    }

    if (target.classList != null 
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

    let target = chapterElem.querySelector(allowedTagsSelector);
    //todo: Traverse tree since the target may contain childs.
    
    return target;
}

export function toggleReading() {
    isReading.value ? stopReading():startReading();
}

/* export function pauseResume() {
    if (isReading.value) {
        speechSynthesis.pause()
    } else {
        speechSynthesis.resume()
    }
    isReading.value = !isReading.value
} */

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

    if (wordIndex < elem.children.length) {
        wordElem = elem.children.item(wordIndex++)
        wordElem.classList.add(className.word);
    }
}

class Transformer {
    clone = null;
    last = null;
    static transform() {
        let resumed = elem.isSameNode(this.last)

        this.last = elem;
        this.clone = elem.innerHTML;
        elem.classList.add(className.para)
        
        let read = ""
        const words = elem.innerText.split(" ");

        if (resumed) {
            for (let i = 0; i < wordIndex; i++) {
                read += words[i] + " ";
            }
        } else 
            wordIndex = 0;

        elem.innerHTML =
            words
            .map(word =>
                `<span>${word}</span>`
            )
            .join(' ');
            
        if(!isElementInViewport(elem))
            elem.scrollIntoView({block:"start"});

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