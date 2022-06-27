<template>
<article ref="mainElem">
    <button class="naver" ref="prev" @click="EnhancedEpub.instance.previous">^</button>
    <div
        @mouseup="identifySpeechTarget"
        @contextmenu.prevent.stop="showContextMenu($event)"
        class="chapter"
        v-for="[key, html] of Flow.items" 
        :key="key"
        :id="key"
        v-html="html"
    >
    </div>
    <button class="naver" ref="next" @click="EnhancedEpub.instance.next">V</button>

    <vue-simple-context-menu
        element-id="page-context"
        :options="menuItems"
        ref="pageContextMenu"
        @option-clicked="optionClicked"
    />
</article>
</template>

<script setup>
import {Flow} from "../modules/reactives";
import { BookmarkController } from "../modules/Bookmarks";
import {mainElem} from "../modules/useMainElem"
import EnhancedEpub from "../modules/EnhancedEpub";
import {next, prev, mayAdd, mayDrop} from "/src/modules/controlFlow"
import { ref, nextTick, onMounted, watch} from "vue";
import { refocus } from "../modules/helpers";
import {identifySpeechTarget} from "./tts/TTS"
import {at} from "/src/modules/Maps"
const pageContextMenu = ref()
var righted = null

const menuItems = [
    {
        name: "&#x1F50A;",
        type:"read",
        cb() {
            reader.start()
            reader.stop()
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
    console.log(item, option);
}

/**
 * @param {Event} e 
 * @param {string} key 
 */
function showContextMenu(e) {
    righted = e.target
    pageContextMenu.value.showMenu(e);
}

watch(Flow.items, async() => {
    let pos;
    switch(Flow.items.size) {
        case 2:
            pos = 0
        break;
        case 3:
            pos = 1
        break;
        default:
            return;
    }
    const id = at(pos, Flow.items)
    await nextTick()
    refocus(document.getElementById(id))
    //BookmarkController.reapply()
})

onMounted(() => {
  mayAdd()
  mayDrop()
})
</script>

<style lang='sass' scoped>
@import "src/sass/media_queries"
@import "src/sass/mixins"
    
div.chapter
    flex: 1
    margin: 1vh 1vw
    :deep(img) /* Uses deep cause of v-html */
        /* Sizing */
        object-fit: contain
        max-width: 80%
        max-height: 80vh

        /* Aligns center */
        margin-inline: auto
        display: block

    :deep(h1, h2, h3, h4, h5, h6)
        align-self: center

article
    @include lex
    overflow: inherit
    width: 100%
    height: -webkit-fill-available

.pager
    position: sticky
    bottom: 0

.naver
    padding: 1vh 0
    background: none
    border: none
</style>