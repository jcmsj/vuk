<template>
    <q-item>
        <q-item-label header>
            Max Depth:
        </q-item-label>
        <q-item-section>
            <q-input type="number" v-model="maxDepth" :autogrow="true" style="width:max-content" />
        </q-item-section>
    </q-item>
</template>
<script setup lang="ts">
import { watch } from "vue";
import { maxDepth, DEFAULT_MAX_DEPTH } from "../TOC"

watch(maxDepth, it => {
        if (isNaN(it)) {
            maxDepth.value = DEFAULT_MAX_DEPTH;
        }
})
</script>
<style lang="sass" scoped>
.q-input
        width: max-content
</style>
