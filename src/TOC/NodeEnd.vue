<template>
<q-item>
    <q-item-section avatar @click="toggleChild">
        <q-icon :name="isChildActive ? 'expand_less':'expand_more'"/>
    </q-item-section>
    <q-item-section :data-id="props.item.id"  >
    {{item.title}}
    </q-item-section>
</q-item>
<NodeStart
    :items="props.items" 
    :active="isChildActive"
/>
</template>
<script setup>
import { ref } from "vue"
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
@use "src/sass/v-item"
</style>