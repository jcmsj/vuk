<template>
<section>
    <div
        @click="toggleReading"
    >
    {{isReading ? "&#x23f8;":"&#9654;&#65039;"}}
    </div>
    <select
        ref="select"
    >
         <option
            v-for="({name}, i) in voices"
            :key="i"
            :value="name"
        >
        {{name}}
        </option>
    </select>
</section>
</template>
<script setup>
import {isReading, toggleReading} from "../modules/TTS.js";
import { onMounted, ref } from "vue";
import { onKeyUp } from "@vueuse/core";
const voices = ref([])
const select = ref(null)
onKeyUp("r", () => {
    toggleReading()
})

// Can't instanstly set voices by calling the speechSynthesis method below
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
<style lang="sass">
    .s-read
        background-color: #53e7f5
    
    span.current-word
        background-color: #FFFF00
</style>

<style lang="sass" scoped>
    section
        display: flex
        flex-direction: row

    select::before
        content: "Voice"
</style>