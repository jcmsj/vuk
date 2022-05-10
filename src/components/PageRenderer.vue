<template>
    <div class="book-text" v-html="Book.content">
    </div>
</template>
<script setup>
import {Book} from "../modules/Book"

</script>
<style lang='sass'>
.book-text
    padding: 1vh 1vw
    display: flex
    flex-direction: column
    align-items: center
    font-size: larger
    flex: 1
    width: inherit

    img
        object-fit: contain
        max-width: 80vw
        max-height: 80vh
        margin: 1vh 1vw
</style>