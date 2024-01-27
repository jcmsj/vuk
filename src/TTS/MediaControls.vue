<template>
<q-btn icon="fast_rewind" />
<q-btn 
    :icon="icon"
    @click="narrator.toggle()"
/>
<q-btn icon="fast_forward" />
</template>
<script setup lang=ts>
import {isReading } from ".";
import {onKeyUp} from "@vueuse/core";
import { narrator } from "./Narrator";
import { computed, watch } from "vue";

const keys = ["r","F8","MediaPlayPause"];
const icon = computed(() => isReading.value ? "pause" : "play_arrow")
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
