<template>
<div
    @click="toggleReading"
>
{{isReading ? "||":"&#9658;"}}
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
        background-color: wheat
</style>