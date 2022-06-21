<template>
<main ref="mainElem">
    <div
        @mouseup="identifySpeechTarget"
        class="chapter"
        v-for="[key, part] of Flow.items" 
        :key="key"
        :id="key"
        v-html="part"
        @contextmenu.prevent.stop="showContextMenu($event)"
        >
    </div>
    <vue-simple-context-menu
        element-id="page-context"
        :options="menuItems"
        ref="pageContextMenu"
        @option-clicked="optionClicked"
    />
    <vFooter />
</main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {Flow} from "../modules/reactives";
import { Bookmarks } from "../modules/Bookmarks";
import {startReading, identifySpeechTarget, stopReading} from "./tts/TTS.js";
import vFooter from "./Footer.vue"
import {mainElem, getReadingProgress} from "../modules/useMainElem"

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
            Bookmarks.mark(
                righted,
                getReadingProgress()
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
 * 
 * @param {Event} e 
 * @param {string} key 
 */
function showContextMenu(e) {
    righted = e.target
    pageContextMenu.value.showMenu(e);
}

onMounted(() => {
    Bookmarks.load()
})
</script>

<style lang='sass' scoped>
    
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

.pager
    position: sticky
    bottom: 0

</style>