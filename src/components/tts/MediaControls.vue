<template>
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
</template>
<script setup>
import {isReading, toggleReading} from "./TTS.js";

</script>
<style lang='sass'>
.controls
    display: flex
</style>