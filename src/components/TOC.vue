<template>
<div>
    <div class="content" v-for="(item) of TOC" :key="item" @click="showContent(item.id)">{{item.title}}</div>
    <div
        v-if="TOC.length == 0"
    >
    Table of Contents
    </div>
</div>
</template>

<script setup>
import {inject} from "vue"

const TOC = inject("TOC", [])
const emits = defineEmits(["show"])

function showContent(id) {
    emits("show", id)
}

</script>
<style lang="sass" scoped>
.content
    cursor: pointer
</style>