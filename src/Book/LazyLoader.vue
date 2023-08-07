<template>
    <div class=scroll-loader ref="pageStart"></div>
    <slot></slot>
    <div class=scroll-loader ref="pageEnd"></div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { LoadMethod, loadMethod } from "src/Library/Load";

const pageStart = ref<HTMLDivElement>()
const pageEnd = ref<HTMLDivElement>()

onMounted(() => {
    observe()
})

const emit = defineEmits<{
    next: [],
    prev: [],
    stop: [],
}>()

const options = Object.freeze({
    root: null,
    rootMargin: "0px",
    threshold: 0.9
});

const forwarder = useIntersectionObserver(pageEnd, ([entry]) => {
    if (entry.isIntersecting) {
        entry.target.classList.remove("add");
        emit("next")
    }
}, options)

const backtracker = useIntersectionObserver(pageStart, ([entry]) => {
    if (entry.isIntersecting) {
        entry.target.classList.remove("rem", "hasleft");
        emit("prev")
    }
}, options)

/**
 * Disables Chapter loaders
 */
function unobserve() {
    forwarder.pause()
    backtracker.pause()
}

function observe() {
    forwarder.resume()
    backtracker.resume()
}

watch(() => loadMethod.value == LoadMethod.lazy, (shouldObserve) => {
    if (shouldObserve) {
        observe()
    } else {
        unobserve()
        emit("stop")
    }
})
</script>
<style lang='sass' scoped>
.scroll-loader
    height: 8vh
</style>
