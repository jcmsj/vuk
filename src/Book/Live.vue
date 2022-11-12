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
import { BookmarkController } from "../Bookmarks";
import { mainElem } from "../lib/useMainElem"
import { identifySpeechTarget, startReading, stopReading } from "../TTS"
import { anchorClicked } from "../Library/anchorClicked"
import SpeechSynthesis from "../TTS/SpeechSynthesis.vue"
import { view, next, prev, pages } from "./Pages"
import { unobserve, observe } from "./index"
import { narrator } from "../TTS/Narrator"
import ContextMenu from "./ContextMenu.vue";
import { onActivated, onBeforeUpdate, onDeactivated, onMounted, onUpdated, ref, watch } from "vue";
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import { savedPositions } from 'src/router/storeScrollBehavior';

onMounted(() => {
    observe(false)
})

onBeforeRouteLeave((to, from) => {
    console.log(from.matched);
    savedPositions[from.fullPath] = { x: window.scrollX, top: window.scrollY }
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