<template>
    <article ref="el"></article>
</template>
<script setup lang=ts>
import getScrollPercentage from 'src/lib/getScrollPercentage';
import { provide, ref } from 'vue';
const el = ref<HTMLElement>();

export function getReadingProgress() {
    return getScrollPercentage(el.value)
}

provide("get-reading-progress", getReadingProgress);
</script>