import {narrator} from "./Narrator"
export {isReading} from "./isReading"
export const toggleReading = narrator.toggle.bind(narrator);
export const startReading = narrator.start.bind(narrator);
export const stopReading = narrator.stop.bind(narrator);
export const identifySpeechTarget = narrator.identify.bind(narrator);