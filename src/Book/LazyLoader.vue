<template>
    <div class=scroll-loader ref="pageStart"></div>
    <slot></slot>
    <div class=scroll-loader ref="pageEnd"></div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { instance } from "src/lib/EnhancedEpub";
import { loadMethod, LoadMethod } from "src/Library/Load";
import { useIntersectionObserver } from "@vueuse/core";

const pageStart = ref<HTMLDivElement>()
const pageEnd = ref<HTMLDivElement>()

onMounted(() => {
    observe()
})

const options = Object.freeze({
    root: null,
    rootMargin: "0px",
    threshold: 0.9
});

const forwarder = useIntersectionObserver(pageEnd, ([entry]) => {
    if (entry.isIntersecting) {
        entry.target.classList.remove("add");
        instance.value?.next();
    }
}, options)

const backtracker = useIntersectionObserver(pageStart, ([entry]) => {
    if (entry.isIntersecting) {
        entry.target.classList.remove("rem", "hasleft");
        instance.value?.previous();
    }
}, options)

/**
 * Disables Chapter loaders
 */
async function unobserve() {
    forwarder.pause()
    backtracker.pause()
}

async function observe() {
    if (loadMethod.value == LoadMethod.lazy) {
        forwarder.resume()
        backtracker.resume()
    }
}

watch(loadMethod, async (preferred) => {
    if (preferred == LoadMethod.all) {
        await unobserve()
        instance.value?.loadAll()
    } else {
        await observe()
    }
})
</script>
<style lang='sass' scoped>
.scroll-loader
    height: 8vh
</style>
