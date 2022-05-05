<template>
</template>

<script setup>
import {ref} from "vue"
import {ChapterPart} from "Part.vue"
const props = defineProps({
    name = {
        type:String
    },
    parts = {

    },
    prev = {
        type:String
    },
    next = {
        type:String
    } 
})
</script>

<style>

</style>