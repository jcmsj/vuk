<template>
    <div v-if="TOC.items.size == 0">
        Table of Contents
    </div>
    <NodeStart
        v-else
        :active="true"
        :items="TOC.items"
        :level="0"
    >
    </NodeStart>
</template>

<script setup>
import NodeStart from "./NodeStart.vue"
import {TOC} from "../../modules/TOC.js"
</script>
<style lang="sass" scoped>
</style>