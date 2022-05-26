<template>
<section>
    <div>&#x1F50A;</div>
    <div
        class="controls"
    >
        <div>
            ⏪
        </div>
        <div
            @click="toggleReading"
        >
        {{isReading ? "&#x23f8;":"&#9654;&#65039;"}}
        </div>
        <div>
            ⏩
        </div>
    </div>

    <div
        class="voice-ops"
        @click="toggleops"
    >
        &#9881;
    </div>
    <div class="pop-up"
        :active="showOps"
    >
        <span>
        Speed: 
        {{speech_rate.value}}
        </span>
        
        <input type="range"
            list="ticks"
            :min="speech_rate.min"
            :max="speech_rate.max"
            step="0.25"
            :value="speech_rate.value"
            @change="e => speech_rate.set(e.target.value)"
        >
        <datalist id="ticks">
            <option :value="speech_rate.min" :label="speech_rate.min"></option>
            <option value="1" label="1"></option>
            <option value="2" label="2"></option>
            <option :value="speech_rate.max" :label="speech_rate.max"></option>
        </datalist>
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
import {isReading, toggleReading, speech_rate, voice} from "../modules/TTS.js";
import { onMounted, ref } from "vue";
import { onKeyUp } from "@vueuse/core";
const voices = ref([])
const select = ref(null)
onKeyUp("r", () => {
    toggleReading()
})
const showOps = ref(false)
// Can't instanstly set voices by calling the speechSynthesis method below

function toggleops() {
    showOps.value = !showOps.value
}
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

.voice-ops
    justify-self: flex-end
    cursor: pointer

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

input[type="range"]
    padding: 3vh 1vw
    
.controls
    display: flex

</style>