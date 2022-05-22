<template>
<div
    @click="toggleReading"
>
{{_reading ? "| |":"&#9658;"}}
</div>
</template>
<script setup>
import {stopReading, startReading, isReading, toggleReading} from "../modules/TTS.js";
import { onKeyUp } from "@vueuse/core";
import {ref} from "vue"
const _reading = ref(isReading);
onKeyUp("r", toggleReading)

</script>
<style lang="sass">
    .s-read
        background-color: wheat
</style>