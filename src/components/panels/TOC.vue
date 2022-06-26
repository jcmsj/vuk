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

<script setup>
import NodeStart from "./NodeStart.vue"
import {TOC} from "../../modules/reactives"
</script>
<style lang="sass" scoped>
</style>