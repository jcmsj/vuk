import { EV } from "./EV";
import speech_rate from "./speech_rate";
import voice from "./voice";
import { isReading } from "./isReading";
import { narrator } from "./Narrator";
import { transformer } from "./Narrator";

const onEnd = () => narrator.emit(EV.end);
export function readAloud(txt:string) {
    const utt = new SpeechSynthesisUtterance(txt)

    if (transformer.elem) {
        utt.onboundary 
        = e => {
            if (e.name != "word") return;
            transformer.elem?.next();
        }    
    }

    utt.onend = onEnd

    utt.rate = speech_rate.value

    if (voice.value!= null)
        utt.voice = voice.value;

    speechSynthesis.speak(utt);
    isReading.value = true;
}