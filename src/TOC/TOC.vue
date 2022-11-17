<template>
<div>
    <b class="tab-label">Table of Contents</b>
    <NodeStart
        :active="true"
        :items="TOC.items"
        :level="0"
    />
</div>
</template>

<script setup lang=ts>
import NodeStart from "./NodeStart.vue"
import {TOC} from "."
</script>
<style lang="sass" scoped>
</style>