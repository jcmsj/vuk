import { useLocalStorage } from "@vueuse/core";
import { computed, ref } from "vue";
import { Platform } from "quasar";

export const prefVoice = useLocalStorage("voice", () => {
    // The default in Google's TTS has the country included
    if (Platform.is.android) {
        return "English (United States)"
    }
    if (Platform.is.win) {
        return "Microsoft David - English (United States)"
    }

    return "English"
})
export const voices = ref<SpeechSynthesisVoice[]>([]) ;
speechSynthesis.onvoiceschanged = () => {
    voices.value = speechSynthesis.getVoices()
}
export const voice = computed(() => voices.value.find(it => it.name === prefVoice.value));
export enum Status {
    OFF,
    ON,
    UNSUPPORTED
};

export const status = useLocalStorage<Status>("tts-state", () => {
    if (window.speechSynthesis) {
        return Status.ON
    } else {
        return Status.UNSUPPORTED
    }
});
