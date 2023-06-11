<template>
    <label for="voice-pack">
        Narrator:
    </label>
    <select
        name="voice-pack"
        v-model="prefVoice"
    >
        <option
            v-for="({name}) in voices"
            :key="name"
            :value="name"
        >
        {{name}}
        </option>
    </select>
</template>
<script setup lang="ts">
import  {prefVoice, voices} from "./voice";

</script>
<style lang='sass' scoped>
</style>
