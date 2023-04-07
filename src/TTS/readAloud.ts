import { EV } from "./EV";
import speech_rate from "./speech_rate";
import voice from "./voice";
import { isReading } from "./isReading";
import { narrator } from "./Narrator";
import { transformer } from "./Narrator";

function onEnd() {
    return narrator.emit(EV.end);
}

function onBoundary(e: SpeechSynthesisEvent) {
    if (e.name != "word")
        return;
    transformer.elem?.next();
}    
export function readAloud(txt:string) {
    const utt = new SpeechSynthesisUtterance(txt)
    //Don't add the boundary if `txt` contains digits as it unsyncs the highlight with the narrator
    if (!/\d+/.test(txt)) {
        utt.onboundary = onBoundary
    }

    utt.onend = onEnd
    utt.rate = speech_rate.value
    utt.voice = voice.value;

    speechSynthesis.speak(utt);
    isReading.value = true;
}