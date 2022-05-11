<template>
<div>
    <div v-if="Book.singleton == null">
        Table of Contents
    </div>
    <div v-else>
        <NodeStart
            :active="true"
            :items="Book.singleton.toc"
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

/* provide("unified-event", (e) => {
    Book.clickTOC(e)
}) */
</script>
<style lang="sass" scoped>
</style>