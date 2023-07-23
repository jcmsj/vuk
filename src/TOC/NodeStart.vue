<template>
 <div 
    :active="props.active" 
    class="node"
>
    <div v-if="props.level > maxDepth"></div>
    <q-item
        v-else 
        v-for="[key, item] of props.items"
        :key="key"
        clickable
        class="column"
    >
        <NodeEnd
            v-if="item.navPoint"
            :item="item"
            :items="item.navPoint"
            :level="props.level + 1"
        />
        <ItemLink :item="item"/>
    </q-item>
</div>
</template>
<script setup lang="ts">
import { Chapter } from "@jcsj/epub/lib/traits";
import NodeEnd from "./NodeEnd.vue";
import ItemLink from "./ItemLink.vue"
import { maxDepth } from ".";
const props = defineProps< {
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
