import { voice } from "./voice";
import { speech_rate } from "./speech_rate";

/**
 * @param {string} txt 
 * @param {Function} cb 
 * @returns SpeechSynthesisUtterance
 */
export function readAloud(txt) {
    const utterance = new SpeechSynthesisUtterance(txt)
    utterance.rate = speech_rate.value

    if (voice.value!= null )
        utterance.voice = voice.value;

    speechSynthesis.speak(utterance);
    return utterance;
}