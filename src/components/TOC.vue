<template>
<div>
    <!-- <div v-for="(val, key, i) of props" :key="key"></div> -->
</div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import {ref, defineProps, watch, onMounted} from "vue"

// eslint-disable-next-line no-unused-vars
const props = defineProps({
    "TOC": {
    type: Object,
    default() {
        return {}
    }
} })

onMounted(() => {
    console.log(props.TOC);
})
watch(props.TOC, async(newTOC, oldTOC) => {
    console.log("OLD TOC ", oldTOC);
    console.log("NEW TOC ", newTOC);
})
</script>

<style>

</style>