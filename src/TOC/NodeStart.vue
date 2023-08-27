<template>
    <div :active="active" class="node">
        <div v-if="level > maxDepth"></div>
        <q-item v-else v-for="[key, item] of items" :key="key" clickable class="column">
            <NodeEnd v-if="item.navPoint" :item="item as Required<Chapter>" :level="level + 1" />
            <ItemLink v-bind="item" />
        </q-item>
    </div>
</template>
<script setup lang="ts">
import { Chapter } from "@jcsj/epub/lib/traits";
import NodeEnd from "./NodeEnd.vue";
import ItemLink from "./ItemLink.vue"
import { maxDepth } from ".";
defineProps<{
    readonly items: Map<string, Chapter>;
    readonly active: boolean;
    readonly level: number;
}>();

</script>
<style lang='sass' scoped>
@use "src/sass/v-item"

.node
    display: none
    &[active="true"]
        display: block
</style>
