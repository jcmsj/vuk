<template>
<div
    class="controls"
>
    <div>
        ⏪
    </div>
    <div
        @click="reader.toggle"
    >
    {{reader.isReading ? "&#x23f8;":"&#9654;&#65039;"}}
    </div>
    <div>
        ⏩
    </div>
</div>
</template>
<script setup>
import { reader } from "./TTS.js";

</script>
<style lang='sass'>
.controls
    display: flex
</style>