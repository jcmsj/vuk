import {narrator} from "./Narrator"
export {isReading} from "./isReading"
export function toggleReading() {
    narrator.toggle()
}

export function startReading() {
    narrator.start()
}

export function stopReading() {
    narrator.stop()
}

export function identifySpeechTarget(e:MouseEvent) {
    narrator.identify(e)
}