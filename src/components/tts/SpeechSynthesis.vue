<template>
<section>
    <div>&#x1F50A;</div>
    <MediaControls />
    <div
        class="voice-ops"
        @click="toggleops"
    >
        &#9881;
    </div>
    <div class="pop-up"
        :active="showOps"
    >
        <SpeechRateController />        
        <select
            ref="select"
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
    </div>

</section>
</template>
<script setup>
import {toggleReading } from "./TTS.js";
import { onMounted, ref } from "vue";
import { onKeyUp } from "@vueuse/core";

import SpeechRateController from "./SpeechRateController.vue"
import MediaControls from "./MediaControls.vue"
import VoiceSelector from "./VoiceSelector.vue"
const 
    voices = ref([]),
    select = ref(null),
    showOps = ref(false)
;

onKeyUp("r", () => {
    toggleReading()
})

function toggleops() {
    showOps.value = !showOps.value
}

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
<style lang="sass">
.s-read
    background-color: #53e7f5

span.current-word
    background-color: #FFFF00
</style>

<style lang="sass" scoped>
section
    display: flex
    justify-content: space-between
    background-color: gray
    padding: 3px

.pop-up
    font-size: smaller
    padding: 1vh 1vw
    background-color: inherit
    display: none
    position: absolute
    right: 0
    bottom: 7vh
    color: white
    flex-direction: column

    &[active="true"]
        display: flex

</style>