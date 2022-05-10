<template>
<div>
    <div v-if="Book.singleton == null">
        Table of Contents
    </div>
    <div v-else>
        <div class="content" 
            v-for="(item) of Book.singleton.toc" 
            :key="item" 
            @click="Book.updateContent(item.id)"
        >
            {{item.title}}
        </div>
    </div>
</div>
</template>

<script setup>
import {Book} from "../modules/Book.js"

</script>
<style lang="sass" scoped>
.content
    cursor: pointer
</style>