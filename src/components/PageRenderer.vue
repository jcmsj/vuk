<template>
    <main ref="text">
        <slot name="header"></slot>
        <div v-if="Flow.items.size == 0">
            Press: <br>
                C - Show TOC <br>
                F - Show File explorer
        </div>
        <div v-else
            class="chapter"
            v-for="[key, part] of Flow.items" 
            :key="key"
            :id="key"
            v-html="part"
            >
        </div>
        <slot name="footer"></slot>
    </main>
</template>

<script setup>
import { ref, onMounted, watch} from "vue";
import { onKeyStroke, onKeyUp } from "@vueuse/core";
import {Flow} from "../modules/Flow.js";

const text = ref(null)
const pages = ref(0)
let amount = 0;
function movePage(_pages = 1) {
    //Seriously??
    if (_pages == 0)
        return
    
    const height = text.value.scrollHeight;
    const lastPos = text.value.scrollTop;
    //console.log(height, lastPos, amount);
    text.value.scrollBy(0, amount * _pages)

    pages.value += _pages
}

onKeyUp("ArrowRight", e=> {
    movePage()
})

onKeyUp("ArrowLeft", e=> {
    movePage(-1)
})

onMounted(() => {
    amount = document.documentElement.clientHeight
})
</script>
<style lang='sass' scoped>

main
    display: flex
    flex-direction: column
    flex: 1
    align-items: center

    //Temp fix Issue #1
    width: 100%

    font-size: 2rem
    overflow-y: auto
    overflow-x: hidden
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

.chapter
    flex: 1
    margin: 1vh 1vw

.pager
    position: sticky
    bottom: 0
</style>