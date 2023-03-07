<template>
<q-list>
    <q-item-label header>
        Table of Contents
    </q-item-label>
    <NodeStart
        :active="true"
        :items="TOC.items"
        :level="0"
    />
</q-list>
</template>

<script setup lang=ts>
import NodeStart from "./NodeStart.vue"
import {TOC} from "."
</script>
<style lang="sass" scoped>
</style>