import {reactive} from "vue";

export const voice = reactive({
    value : null,
    set(name) {
        this.value = speechSynthesis
            .getVoices()
            .find(v => v.name == name)
            || null
    }
});

export default voice;