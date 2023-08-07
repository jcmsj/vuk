<template>
<q-btn icon="fast_rewind" />
<q-btn 
    :icon="isReading ? 'pause':'play_arrow'" 
    @click="narrator.toggle()"
/>
<q-btn icon="fast_forward" />
</template>
<script setup lang=ts>
import {isReading } from ".";
import {onKeyUp} from "@vueuse/core";
import { narrator } from "./Narrator";
import { watch } from "vue";

const keys = ["r","F8","MediaPlayPause"];
onKeyUp(keys, e => {
    if (e.target instanceof HTMLInputElement) {
        return
    }

    narrator.toggle()
})

watch(isReading, () => {
    if (!isReading.value) {
        narrator.stop()
    }
})


</script>
<style lang='sass'>

</style>
