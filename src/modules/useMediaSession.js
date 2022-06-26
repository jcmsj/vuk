import {startReading, stopReading} from "../components/tts/TTS"
import Metadata from "/src/modules/useMetadata"
import {watch} from "vue"

export const dummyAudio = new Audio("/src/assets/5-seconds-of-silence.mp3")
dummyAudio.load()
dummyAudio.loop = true

navigator.mediaSession.metadata = new MediaMetadata(
    {
        artwork: [
            { src: '/icons/vuk-transparent-128.png', sizes: '128x128', type: 'image/png' }
        ]
    }
)

const actions = {
    "play": startReading,
    "pause": stopReading,
    "stop": stopReading,
    "seekbackward": () => {},
    "seekforward": () => {},
    "seekto": () => {},
    "previoustrack": () => {},
    "previoustrack": () => {},
    "nexttrack": () => {},
}

for (const k in actions) {
    navigator.mediaSession.setActionHandler(k,actions[k])
}

export function setMediaData(book) {
    console.log("Media");
    navigator.mediaSession.metadata.title = book.title
    navigator.mediaSession.metadata.artist = book.creator
    navigator.mediaSession.metadata.album = book.publisher
}
 
export default setMediaData