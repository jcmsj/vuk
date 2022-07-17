<template>
<article ref=mainElem>
    <SpeechSynthesis />
    <div class=naver ref=prev />
    <div
        @mouseup="identifySpeechTarget"
        @dblclick="showContextMenu($event)"
        id="__live"
        @click="anchorClicked"
    >
    </div>
    <div class=naver ref=next />
    <vue-simple-context-menu
        element-id=page-context
        :options="menuItems"
        ref=pageContextMenu
        @option-clicked="optionClicked"
    />
</article>
</template>

<script setup>
import {BookmarkController} from "../Bookmarks";
import {mainElem} from "../modules/useMainElem"
import { ref, onMounted } from "vue";
import {identifySpeechTarget, startReading, stopReading} from "../TTS"
import { setLive, next, prev } from ".";
import {anchorClicked} from "../Library/anchorClicked"
import SpeechSynthesis from "../TTS/SpeechSynthesis.vue"
import { ChapterWalker } from "../TTS/walker";
const pageContextMenu = ref()
var righted = null

const menuItems = [
    {
        name: "&#x1F50A;",
        type:"read",
        cb() {
            stopReading()
            startReading()
        }
    },
    {
        name: "&#x1F516;",
        type:"bookmark",
        cb() {
            BookmarkController.toggle(
                righted
            )
        }
    },
    {
        name: "&#x1F4CB;",
        type:"copy",
        cb() {}
    }
]

function optionClicked({item, option}) {
    option.cb()
}

/**
 * @param {Event} e 
 * @param {string} key 
 */
function showContextMenu(e) {
    righted = e.target
    pageContextMenu.value.showMenu(e);
}

onMounted(() => {
    setLive("__live")
    console.log(ChapterWalker.instance);
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

.pager
    position: sticky
    bottom: 0

.naver
    min-height: 8vh
</style>