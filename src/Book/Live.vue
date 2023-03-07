<template>
    <article ref="mainElem">
        <EPUBStyle />
        <SpeechSynthesis />
        <div class=naver ref="prev"></div>
        <div @mouseup="identifySpeechTarget" id="__live" ref="view" @click="anchorClicked">
            <div class="chapter" v-for="page in pages" v-html="page.html" :key="page.id" :id="page.id">

            </div>
            <ContextMenu />
        </div>
        <div class=naver ref="next"></div>
    </article>
</template>
<script setup>
//ISSUE: TS not working
import { onMounted, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { mainElem } from "../lib/useMainElem"
import SpeechSynthesis from "../TTS/SpeechSynthesis.vue"
import { anchorClicked } from "../Library/anchorClicked"
import { identifySpeechTarget } from "../TTS"
import { view, next, prev, pages } from "./Pages"
import { observe, unobserve } from "./index"
import ContextMenu from "./ContextMenu.vue";
import { savedPositions } from 'src/router/storeScrollBehavior';
import { LoadMethod, loadMethod } from "src/Library/Load";
import { instance } from "src/lib/EnhancedEpub";
import EPUBStyle from "./EPUBStyle.vue";
import { useEventListener } from "@vueuse/core";
import "../Bookmarks/background"; // For Side effects

onMounted(() => {
    observe(false)
})

watch(loadMethod, async (preferred) => {
    if (preferred == LoadMethod.all) {
        await unobserve()
        instance?.loadAll()
    } else {
        await observe(false)
    }
})

useEventListener("beforeunload", ev => {
    //For preventing 3rd party navigation
    // and times where the parser fails to reconcile spine ids with anchors
    ev.preventDefault();
    return ev.returnValue = '';
})

onBeforeRouteLeave((_, from) => {
    console.log("before", from.matched);
    savedPositions[from.fullPath] = { left: window.scrollX, top: window.scrollY }
})

</script>
<style lang="sass">
.bookmark
    border: 1px solid green

div.chapter
    min-height: 110vh
    display: flex
    flex-direction: column

    img, svg:has(image) /* Uses deep cause of v-html */
        /* Sizing */
        object-fit: contain
        max-width: 80% !important
        max-height: 80vh !important

        /* Aligns center */
        margin-inline: auto
        display: block

    h1, h2, h3, h4, h5, h6
        align-self: center

        //Patch for stylized chapter titles for now
        img
            display: inline
</style>
<style lang='sass' scoped>
@import "src/sass/media_queries"
@import "src/sass/mixins"
    
#__live 
    flex: 1
    margin: 1vh 1vw
    
.pager
    position: sticky
    bottom: 0

.naver
    height: 8vh

article
    overflow-y: auto
    height: 100%
</style>