<template>
<div>
    <div v-if="Book.singleton == null">
        Table of Contents
    </div>
    <div v-else>
        <div class="content" 
            v-for="(item) of Book.singleton.toc" 
            :key="item"
            :data-id="item.id"  
            @click="update"
        >
            {{item.title}}
        </div>
    </div>
</div>
</template>

<script setup>
import {Book} from "../modules/Book.js"

function update(e) {
    const id = e.target.dataset.id
    console.log("TOC ID: ", id);
    Book.updateContent(id)
}

</script>
<style lang="sass" scoped>
.content
    cursor: pointer
</style>