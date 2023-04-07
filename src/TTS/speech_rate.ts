import { useLocalStorage } from "@vueuse/core";
export const min = 0.25;
export const max = 3;

export const speech_rate = useLocalStorage("speech-rate", 1);
export default speech_rate;