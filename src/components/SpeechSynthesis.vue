<template>
<div
    @click="toggleReading"
>
{{isReading ? "&#x23f8;":"&#9654;&#65039;"}}
</div>
</template>
<script setup>
import {isReading, toggleReading} from "../modules/TTS.js";
import { onKeyUp } from "@vueuse/core";

onKeyUp("r", () => {
    toggleReading()
})

</script>
<style lang="sass">
    .s-read
        background-color: #53e7f5
    
    span.current-word
        background-color: #FFFF00
</style>