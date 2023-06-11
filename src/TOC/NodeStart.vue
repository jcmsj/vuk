<template>
 <div 
    :active="props.active" 
    class="node"
>
    <div v-if="props.level > maxLevel"></div>
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
        <router-link
            v-else 
            :to="'/#' + item.id"
            @click="anchorClicked($event, item.id)"
        >
            {{item.title}}
        </router-link>
    </q-item>
</div>
</template>
<script setup lang="ts">
import NodeEnd from "./NodeEnd.vue";
import {anchorClicked} from "../Library/anchorClicked"
import { Chapter } from "@jcsj/epub/lib/traits";

const maxLevel = 7;
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
