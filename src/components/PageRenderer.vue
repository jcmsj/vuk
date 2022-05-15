<template>
    <div class="book-text" v-html="Book.content" ref="text">
    </div>
</template>
<script setup>
import { ref, onMounted, watch} from "vue";
import {Book} from "../modules/Book"
import { onKeyStroke } from "@vueuse/core";

const text = ref(null)
let amount = 0;
function movePage(_pages = 1) {
    //Seriously??
    if (_pages == 0)
        return
    
    const height = text.value.scrollHeight;
    console.log(height, text.value.scrollTop, amount);
    console.log(_pages);
    text.value.scrollBy(0, amount * _pages)
    pages.value += _pages
}

const pages = ref(0)
const pagenum = ref(0);
onKeyStroke("ArrowRight", e=> {
    movePage()
})

onKeyStroke("ArrowLeft", e=> {
    movePage(-1)
})

onMounted(() => {
    amount = document.documentElement.clientHeight
    Book.updateContent()
  

})
</script>
<style lang='sass' scoped>
.book-text
    padding: 1vh 1vw
    font-size: 2rem
    max-width: 100%
    overflow-y: hidden

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
.pager
    position: sticky
    bottom: 0
</style>