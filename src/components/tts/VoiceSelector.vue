<template>
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
</template>
<script setup>
import {voice} from "./TTS.js";

</script>
<style lang='sass' scoped>
.voice-ops
    justify-self: flex-end
    cursor: pointer
</style>