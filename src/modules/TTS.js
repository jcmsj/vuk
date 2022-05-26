import {ref} from "vue";
import {get, set} from "idb-keyval";
const className = {
    para: "s-read",
    word: "current-word"
}
const allowedTags = /^(P|A|H[1-6])$/;
var elem = null
var wordIndex = 0;
var wordElem = null;
import {reactive} from "vue";
export const voice = reactive({
    value : null,
    set(name) {
        for (const v of speechSynthesis.getVoices()) {
            if (v.name == name) {
                this.value = v;
                return;
            }
        }
        
        this.value = null;
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
        set("speech-rate", this.value);
    }
})

get("speech-rate").then(n => {
    speech_rate.set(n || 1);
})

export const isReading = ref(false);
export function identifySpeechTarget(e) {
    const [_elem] = e.path.filter(_elem => allowedTags.test(_elem.tagName))

    if (!_elem) return;
    stopReading()
    setSpeechTarget(_elem)
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
    Transformer.last = elem;
    elem = _elem;
    console.log(elem);
}

export function startReading() {
    if (elem == null) return
    
    //Start reading at the selected text
    let txt = elem.innerText;
    txt = txt.slice(txt.indexOf(getSelectionText()))

    beforeSpeak(txt);
}

function beforeSpeak(txt) {
    Transformer.transform()
    const utterance = readAloud(txt)
    utterance.onstart = highlightWord
    utterance.onboundary = highlightWord
    utterance.onend = () => {
        Transformer.revert();

        if (!isReading.value) return;

        let target = elem.nextElementSibling || elem.parentElement.nextElementSibling
        setSpeechTarget(target);
        try {
            beforeSpeak(target.innerText);
        }
        catch(e) {
            console.log(target);
        }
    };

    isReading.value = true;
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
    let utterance = new SpeechSynthesisUtterance(txt)
    utterance.rate = speech_rate.value

    if (voice.value != null)
        utterance.voice = voice.value;

    speechSynthesis.speak(utterance);
    return utterance;
}

function highlightWord(event) {
    if (event.name != "word") return;
    
    wordElem != null && wordElem.classList.remove(className.word)

    if (wordIndex < elem.children.length) {
        wordElem = elem.children.item(wordIndex++)
        wordElem.classList.add(className.word);
    }
}

class Transformer {
    clone = null;
    last = null;
    static transform() {
        this.last = elem;
        this.clone = elem.innerHTML;
        elem.classList.add(className.para)
    
        elem.innerHTML = 
            elem.innerText.split(" ")
            .map(word =>
                `<span>${word}</span>`
            )
            .join(' ');
            
        if(!isElementInViewport(elem)) {
            elem.scrollIntoView({block:"start"})
        }
    }

    static revert() {
        if (this.last == null) return;
        this.last.innerHTML = this.clone
        this.last.classList.remove(className.para)
        wordIndex = 0;
    }
}

export function stopReading() {
    if (isReading.value == false) return;

    speechSynthesis.cancel();
    isReading.value = false;
    Transformer.revert()
}