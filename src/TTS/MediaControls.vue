<template>
<q-btn icon="fast_rewind" />
<q-btn 
    :icon="isReading ? 'pause':'play_arrow'" 
    @click="toggleReading"
/>
<q-btn icon="fast_forward" />
</template>
<script setup lang=ts>
import {isReading, toggleReading} from ".";
import {onKeyUp} from "@vueuse/core";

const keys = ["r","F8","MediaPlayPause"];
onKeyUp(keys, toggleReading)

</script>
<style lang='sass'>

</style>