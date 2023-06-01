<template>
<div class=naver ref="prev"></div>
<slot></slot>
<div class=naver ref="next"></div>
</template>
<script setup>
//ISSUE: TS interferes with the IntersectionObserver
import { onMounted, watch } from "vue";
import { next, prev } from "./Pages"
import { observe, unobserve } from ".";
import { instance } from "src/lib/EnhancedEpub";
import { loadMethod, LoadMethod } from "src/Library/Load";

onMounted(() => {
    observe(false)
})

watch(loadMethod, async (preferred) => {
    if (preferred == LoadMethod.all) {
        await unobserve()
        instance.value?.loadAll()
    } else {
        await observe(false)
    }
})
</script>
<style lang='sass' scoped>
.naver
    height: 8vh
</style>