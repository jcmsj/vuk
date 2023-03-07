<template>
    <label for="voice-pack">
        Narrator:
    </label>
    <select
        name="voice-pack"
        @change="voice.set($event.target!.value)"
        :value="prefVoice"
    >
        <option
            v-for="({name}) in voice.voices"
            :key="name"
            :value="name"
        >
        {{name}}
        </option>
    </select>
</template>
<script setup lang="ts">
import { onBeforeMount } from "vue";
import voice, {prefVoice} from "./voice";

onBeforeMount(() => {
    voice.onMount()
})
</script>
<style lang='sass' scoped>
</style>