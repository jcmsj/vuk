import { useLocalStorage } from "@vueuse/core";
import { reactive } from "vue";
import { Platform } from "quasar";
export const voice = reactive({
    // Using null as SpeechSynthesisUtterance.value uses null
    value: null as SpeechSynthesisVoice | null,
    voices: [] as SpeechSynthesisVoice[],
    attempts: 5,
    set(name: string) {
        this.value = this.find(v => v.name == name) ?? null
    },
    find(cb: (v: SpeechSynthesisVoice) => boolean) {
        return this.voices.find(cb)
    },
    search(name: string) {
        return this.find(v => v.name.includes(name))
    },
    load() {
        if (!this.voices.length) {
            this.voices = this.init
        }
    },
    get init() {
        return speechSynthesis.getVoices()
    },
    onMount() {
        if (!window.speechSynthesis) {
            alert("Speech Synthesis is unsupported!");
            return;
        }
        this.load()
    }
});
export const prefVoice = useLocalStorage("voice", () => {
    // The default in Google's TTS has the country included
    if (Platform.is.android) {
        return "English (United States)"
    }

    return "English"
})

export default voice;