<template>
<div>
    <span @click="toggleChild">
    [{{(isChildActive) ? "-":"+"}}] </span>
    <span
        :data-id="props.item.id"  
    >{{item.title}}
    </span>
    <NodeStart
        :items="props.items" 
        :active="isChildActive"
    ></NodeStart>
</div>
</template>
<script setup>
import {ref, inject} from "vue"
import NodeStart from "./NodeStart.vue";
const isChildActive = ref(false)

const props = defineProps({
    "item": {
        type: Object,
        default() {
            return {}
        }
    },
    "items": {
        type: Map,
        default() {
            return new Map()
        }
    }
})
function toggleChild() {
    isChildActive.value = !isChildActive.value
}
</script>

<style lang="sass" scoped>
span
    cursor: pointer
</style>