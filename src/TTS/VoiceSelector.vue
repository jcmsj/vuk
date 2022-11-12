<template>
    <label for="voice-pack">
        Narrator:
    </label>
    <select
        ref="select"
        name="voice-pack"
        @change="e => voice.set(e.target.value)"
    >
        <option
            v-for="({name}, i) in voices"
            :key="i"
            :value="name"
        >
        {{name}}
        </option>
    </select>
</template>
<script setup>
import {ref, onMounted} from "vue"
import voice from "./voice";
const voices = ref([])

// Can't instanstly set voices, must use this.
async function loadvoices() {
    if(speechSynthesis.getVoices().length == 0) {
        setTimeout(loadvoices, 1000)
    }

    voices.value = speechSynthesis.getVoices()
}

onMounted(() => {
    loadvoices()
})

</script>
<style lang='sass' scoped>
</style>