var elem = null
const className = "s-read"
var utterance = null;

export let isReading = false;
export function identfiySpeechTarget(e) {
    const [_elem] = e.path.filter(_elem => ["P", "H1", "H2", "H3", "H4", "H5", "H6", "A"].includes(_elem.tagName))

    if (!_elem) return;

    stopReading();
    setSpeechTarget(_elem)
}

export function setSpeechTarget(_elem) {
    elem = _elem;
    console.log(elem);
}

export function startReading() {
    elem.classList.add(className);
    readAloud(elem.innerText, () => {
        elem.classList.remove(className)
        
        if (isReading) {
            setSpeechTarget(elem.nextElementSibling);
            startReading()    
        }
    })
    isReading = true;
}

export function toggleReading() {
    isReading ? stopReading():startReading();
}
export function getSelectionText() {
    let text = "";
    if (window.getSelection)
        text = window.getSelection().toString();
    else if (document.selection && document.selection.type != "Control")
        text = document.selection.createRange().text;

    return text;
}

/**
 * @param {string} txt 
 * @param {Function} cb 
 */
async function readAloud(txt, cb) {
    txt = txt.slice(txt.indexOf(getSelectionText()))
    utterance = new SpeechSynthesisUtterance(txt)
    speechSynthesis.speak(utterance);
    utterance.onend = cb;
}

export function stopReading() {
    elem && elem.classList.remove(className)
    speechSynthesis.cancel();
    isReading = false;
}