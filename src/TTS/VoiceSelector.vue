<template>
    <label for="voice-pack">
        Narrator:
    </label>
    <select
        name="voice-pack"
        @change="voice.set($event.target.value)"
        :value="prefVoice"
    >
        <option
            v-for="({name}, i) in voice.voices"
            :key="i"
            :value="name"
        >
        {{name}}
        </option>
    </select>
</template>
<script setup lang="ts">
import voice, {prefVoice} from "./voice";

</script>
<style lang='sass' scoped>
</style>