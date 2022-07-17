import {ChapterWalker} from "./walker"
export {isReading} from "./isReading"
export function toggleReading() {
    ChapterWalker.instance.toggle()
}

export function startReading() {
    ChapterWalker.instance.start()
}

export function stopReading() {
    ChapterWalker.instance.stop()
}

export function identifySpeechTarget(e:MouseEvent) {
    ChapterWalker.instance.identify(e)
}
