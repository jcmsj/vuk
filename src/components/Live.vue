<template>
<article ref="mainElem">
    <div class="naver" ref=prev />
    <div
        @mouseup="identifySpeechTarget"
        @contextmenu.prevent.stop="showContextMenu($event)"
        id=__view
    >
    </div>
    <div class="naver" ref=next />
    <vue-simple-context-menu
        element-id="page-context"
        :options="menuItems"
        ref="pageContextMenu"
        @option-clicked="optionClicked"
    />
</article>
</template>

<script setup>
import BookmarkController from "../Bookmarks/BookmarkController";
import {mainElem} from "../modules/useMainElem"
import { ref, onMounted } from "vue";
import {identifySpeechTarget} from "../TTS/TTS"
import { setView, next, prev } from "./Live";
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

onMounted(() => {
    setView("__view")
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
    
#__view
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