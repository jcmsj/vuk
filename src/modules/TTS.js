import {ref, reactive} from "vue";
import {get, set} from "idb-keyval";
const className = {
    para: "s-read",
    word: "current-word",
    overlay : "overlay"
}
const allowedTags = /^(P|A|H[1-6])$/;
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
    Transformer.last = elem;
    elem = _elem;
    console.log(elem);
}

export function startReading() {
    if (elem == null) return
    
    //Start reading at the selected text
    let txt = elem.innerText;
    txt = txt.slice(txt.indexOf(getSelectionText()))

    beforeSpeak((txt == lastSelectedText) 
        ? null: txt
    );
}

function moveSpeechCursor(target) {
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
function beforeSpeak(txt) {
    if (txt == null) {
        txt = lastSelectedText
    } else
        lastSelectedText = txt;

    
    const alreadyRead = Transformer.transform()
    txt = txt.slice(alreadyRead);

    const utterance = readAloud(txt)
    //speech_overlay.clone = elem.outerHTML;
    utterance.onstart = highlightWord
    utterance.onboundary = highlightWord
    utterance.onend = (e) => {
        moveSpeechCursor(elem.nextElementSibling || elem.parentElement.nextElementSibling)
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
    const utterance = new SpeechSynthesisUtterance(txt)
    utterance.rate = speech_rate.value

    if (voice.value != null)
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
    
        let read = ""
        const words = elem.innerText.split(" ");

        while(wordIndex > 0) {
            read += words.shift() + " ";
            wordIndex--;
        }

        elem.innerHTML = read +
            words
            .map(word =>
                `<span>${word}</span>`
            )
            .join(' ');
            
        if(!isElementInViewport(elem)) {
            elem.scrollIntoView({block:"start"})
        }

        return read.length;
    }

    static revert() {
        if (this.last == null) return;
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