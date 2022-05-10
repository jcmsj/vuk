<template>
    <div class="book-text" v-html="Book.content">
    </div>
</template>
<script setup>
import { onMounted } from "vue";
import {Book} from "../modules/Book"

onMounted(() => {
    Book.updateContent()
})
</script>
<style lang='sass' scoped>
.book-text
    padding: 1vh 1vw
    font-size: larger
    max-width: 100%

    :deep(img) /* Uses deep cause of v-html */
        /* Sizing */
        object-fit: contain
        max-width: 80vw
        max-height: 80vh

        /* Aligns center */
        margin-inline: auto
        display: block

    :deep(h1, h2, h3, h4, h5, h6)
        align-self: center
        
</style>