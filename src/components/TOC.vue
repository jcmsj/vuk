<template>
<div>
    <div class="content" v-for="(item) of props.TOC" :key="item" @click="showContent(item.id)">{{item.title}}</div>
</div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import {ref} from "vue"

// eslint-disable-next-line no-unused-vars
const props = defineProps({
    "TOC": {
        type: Array,
        default() {
            return []
        }
    }
})

const emits = defineEmits(["show"])
function showContent(id) {
    emits("show", id)
}

</script>
<style lang="sass" scoped>
.content
    cursor: pointer
</style>