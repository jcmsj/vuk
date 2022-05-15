<template>
<div>
    <div v-if="TOC.items.length <= 0">
        Table of Contents
    </div>
    <div v-else>
        <NodeStart
            :active="true"
            :items="TOC.items"
            :level="0"
        >
        </NodeStart>
    </div>
</div>
</template>

<script setup>
import {provide } from "vue";
import {Book} from "../modules/Book.js"
import NodeStart from "./NodeStart.vue"
import {TOC} from "../modules/TOC.js"
</script>
<style lang="sass" scoped>
</style>