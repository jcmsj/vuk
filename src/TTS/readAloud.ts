import Word from "./Word";
import { EV } from "./EV";
import speech_rate from "./speech_rate";
import voice from "./voice";
import { isReading } from "./isReading";
import { narrator } from "./Narrator";

export function readAloud(txt:string) {
    const utt = new SpeechSynthesisUtterance(txt)
    utt.onboundary 
    = utt.onstart 
    = Word.highlight.bind(Word);
    utt.onend = () => narrator.emit(EV.end);
    utt.rate = speech_rate.value

    if (voice.value!= null)
        utt.voice = voice.value;

    speechSynthesis.speak(utt);
    isReading.value = true;
}