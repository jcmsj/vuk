<template>
<q-btn icon="fast_rewind" />
<q-btn 
    :icon="isReading ? 'pause':'play_arrow'" 
    @click="toggleReading"
/>
<q-btn icon="fast_forward" />
</template>
<script setup>
import {isReading, toggleReading} from ".";
import { onKeyUp } from "@vueuse/core";

onKeyUp("r", toggleReading)

</script>
<style lang='sass'>

</style>