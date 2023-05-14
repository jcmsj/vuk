<template>
    <article ref="mainElem">
        <EPUBStyle />
        <SpeechSynthesis />
        <div class=naver ref="prev"></div>
        <div @mouseup="identifySpeechTarget" id="__live" ref="view" @click="anchorClicked">
            <VPage v-for="page in pages" :key="page.id" :page="page" />
            <ContextMenu />
        </div>
        <div class=naver ref="next"></div>
    </article>
</template>
<script setup lang=ts>
//ISSUE: TS not working
import { onMounted, watch } from "vue";
import { mainElem } from "../lib/useMainElem"
import SpeechSynthesis from "../TTS/SpeechSynthesis.vue"
import { anchorClicked } from "../Library/anchorClicked"
import { identifySpeechTarget } from "../TTS"
import { view, next, prev, pages } from "./Pages"
import { observe, unobserve } from "./index"
import ContextMenu from "./ContextMenu.vue";
import { LoadMethod, loadMethod } from "src/Library/Load";
import { instance } from "src/lib/EnhancedEpub";
import EPUBStyle from "./EPUBStyle.vue";
import VPage from "./VPage.vue";
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

</script>
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