/* eslint-disable no-unused-vars */
/* eslint-disable */
<script setup>
import {ref, defineEmits} from "vue";

const emits = defineEmits(["update"])
const filer = ref(null);

function showFileSelector() {
    filer.value.click()
}

function onChange(e) {
    const [file] = e.target.files
    emits("update", file)
}
</script> 

<template>
<div>
    <i class="icon" @click="showFileSelector">+</i>
    <input type="file" accept=".epub" ref="filer" @change="onChange">
</div>
</template>

<style scoped>
    i.icon {
        cursor: pointer;
    }

    input
    {
        display: none;
    }
</style>