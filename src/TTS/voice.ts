import { useLocalStorage } from "@vueuse/core";
import { reactive } from "vue";

export const voice = reactive({
    value : undefined as SpeechSynthesisVoice | undefined,
    voices: [] as SpeechSynthesisVoice[],
    set(name:string) {
        this.value = this.find(v => v.name == name)
    },
    find(cb:(v:SpeechSynthesisVoice)=>boolean) {
        return this.voices.find(cb)
    },
    search(name:string) {
        return this.find(v => v.name.includes(name))
    },
    load() {
        this.voices = this.init
    },
    get init() {
        return speechSynthesis.getVoices()
    },
    onMount() {
        if (!window.speechSynthesis) {
            console.log("Speech Synthesis is unsupported!");
            return;
        }
        if (!this.voices.length) {
            this.load()
            if (attempts && this.voices.length == 0) {
                setTimeout(this.onMount.bind(this))
                attempts--
            }
        }
    }
});
let attempts = 5;
export const prefVoice = useLocalStorage("voice", "English")

export default voice;