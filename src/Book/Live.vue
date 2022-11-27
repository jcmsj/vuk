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
import { EnhancedEpub } from "src/lib/EnhancedEpub";
import EPUBStyle from "./EPUBStyle.vue";

onMounted(() => {
    observe(false)
})

watch(loadMethod, async(preferred) => {
    console.log(preferred);
    if (preferred == LoadMethod.all) {
        await unobserve()
        EnhancedEpub.instance?.loadAll()
    } else {
        await observe(false)
    }
})
onBeforeRouteLeave((to, from) => {
    console.log(from.matched);
    savedPositions[from.fullPath] = { left: window.scrollX, top: window.scrollY }
})

</script>
<style lang="sass">

div.chapter
    min-height: 110vh
    display: flex
    flex-direction: column

    img, svg:has(image) /* Uses deep cause of v-html */
        /* Sizing */
        object-fit: contain
        max-width: 80%
        max-height: 80vh

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