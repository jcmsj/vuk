<template>
 <div 
    :active="props.active" 
    class="node"
>
    <div v-if="props.level > maxLevel" />
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
        />
        <a 
            v-else 
            class="item"
            :href="'#' + item.id"
            @click="anchorClicked"
        >
            {{item.title}}
        </a>
    </q-item>
</div>
</template>
<script setup>
import NodeEnd from "./NodeEnd.vue";
import {anchorClicked} from "../Library/anchorClicked"

const maxLevel = 7;
const props = defineProps({
    "items": {
        type: Map,
        default() {
            return new Map()
        }
    },
    "active": {
        type : Boolean,
        default() {
            return true;
        }
    },
    "level": {
        type: Number
    }
})

</script>
<style lang='sass' scoped>
@use "src/sass/v-item"

.node
    display: none
    &[active="true"]
        display: block

</style>