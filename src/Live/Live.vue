<template>
<article ref="mainElem">
    <div
        @mouseup="identifySpeechTarget"
        @contextmenu.prevent.stop="showContextMenu($event)"
        ref=live
        class=view
    />
    <vue-simple-context-menu
        element-id="page-context"
        :options="menuItems"
        ref="pageContextMenu"
        @option-clicked="optionClicked"
    />
</article>
</template>

<script setup>
import { ref } from "vue";
import {live} from "."
import { BookmarkController } from "../Bookmarks";
import {startReading, identifySpeechTarget, stopReading} from "../TTS";
import {mainElem} from "../modules/useMainElem"

const pageContextMenu = ref(null)
var righted = null

const menuItems = [
    {
        name: "&#x1F50A;",
        type:"read",
        cb() {
            stopReading();
            startReading();  
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
 */
function showContextMenu(e) {
    righted = e.target
    pageContextMenu.value.showMenu(e);
}

</script>
<style lang="sass">
div.chapter
    min-height: 100vh
</style>
<style lang="sass" scoped>
@import "src/sass/media_queries"
@import "src/sass/mixins"
    
div.view
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

.pager
    position: sticky
    bottom: 0

article
    @include lex
    overflow: inherit
    width: 100%
</style>