<template>
 <div :active="props.active" class="node">
    <div v-if="props.level > maxLevel"></div>
    <div v-else>
        <div v-for="[key, item] of props.items"
            :key="key"
        >
            <div v-if="item.navPoint">
                <NodeEnd
                    :item="item"
                    :items="item.navPoint"
                >
                </NodeEnd>
            </div>
            <a v-else class="item"
                :href="'#' + item.id"
                @click="Book.clickTOC"
            >
            {{item.title}}
            </a>
        </div>
    </div>
</div>
</template>

<script setup>
import {ref} from "vue"
import {Book} from "../modules/Book.js"
import NodeEnd from "./NodeEnd.vue";
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
.item
    cursor: pointer
.node
    display: none
    &[active="true"]
        display: block
</style>