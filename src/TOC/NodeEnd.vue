<template>
    <q-item>
        <q-item-section avatar @click="toggleChild">
            <q-icon :name="isChildActive ? 'expand_less' : 'expand_more'" />
        </q-item-section>
        <q-item-section :data-id="item.id">
            {{ item.title }}
        </q-item-section>
    </q-item>
    <NodeStart :items="item.navPoint" :active="isChildActive" :level="level" />
</template>
<script setup lang="ts">
import { ref } from "vue"
import NodeStart from "./NodeStart.vue";
import { Chapter } from "@jcsj/epub/lib/traits";

const isChildActive = ref(false)

defineProps<{
    readonly item: Required<Chapter>,
    readonly level: number
}>();
function toggleChild() {
    isChildActive.value = !isChildActive.value
}
</script>

<style lang="sass" scoped>
@use "src/sass/v-item"
</style>
