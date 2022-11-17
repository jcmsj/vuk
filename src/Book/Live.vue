<template>
    <SpeechSynthesis />
        <article ref=mainElem>
            <div class=naver ref="prev"></div>
            <div @mouseup="identifySpeechTarget" id="__live" ref="view" @click="anchorClicked">
                <div class="chapter" v-for="page in pages" v-html="page.html" :key="page.id">

                </div>
            </div>
            <div class=naver ref="next"></div>
            <ContextMenu />
        </article>
</template>

<script setup>
//ISSUE: TS not working
import { onMounted } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { mainElem } from "../lib/useMainElem"
import SpeechSynthesis from "../TTS/SpeechSynthesis.vue"
import { anchorClicked } from "../Library/anchorClicked"
import { identifySpeechTarget } from "../TTS"
import { view, next, prev, pages } from "./Pages"
import { observe } from "./index"
import ContextMenu from "./ContextMenu.vue";
import { savedPositions } from 'src/router/storeScrollBehavior';

onMounted(() => {
    observe(false)
})

onBeforeRouteLeave((to, from) => {
    console.log(from.matched);
    savedPositions[from.fullPath] = { left: window.scrollX, top: window.scrollY }
    //unobserve()
})

</script>
<style lang="sass">

div.chapter
    min-height: 110vh
    display: flex
    flex-direction: column

    img /* Uses deep cause of v-html */
        /* Sizing */
        object-fit: contain
        max-width: 80%
        max-height: 80vh

        /* Aligns center */
        margin-inline: auto
        display: block

    h1, h2, h3, h4, h5, h6
        align-self: center
</style>
<style lang='sass' scoped>
@import "src/sass/media_queries"
@import "src/sass/mixins"
    
#__live 
    flex: 1
    margin: 1vh 1vw

article
    @include lex
    overflow: inherit
    width: 100%
    height: -webkit-fill-available
    overflow-y: auto

.pager
    position: sticky
    bottom: 0

.naver
    min-height: 8vh
</style>