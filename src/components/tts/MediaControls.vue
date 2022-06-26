<template>
<div
    class="controls"
>
    <i>⏪</i>
    <i
        @click="toggleReading"
    >
    {{isReading ? "&#x23f8;":"&#9654;&#65039;"}}
    </i>
    <i>⏩</i>
</div>
</template>
<script setup>
import {isReading, toggleReading} from "./TTS.js";
import { onKeyUp } from "@vueuse/core";

onKeyUp("r", toggleReading)

</script>
<style lang='sass'>
.controls
    display: flex
i
    font-style: normal
    cursor: pointer

</style>