<template>
<main ref="text">
    <vHeader />
    <WelcomePage
        v-if="Flow.items.size == 0"
    />
    <div
        @mouseup="identifySpeechTarget"
        class="chapter"
        v-for="[key, part] of Flow.items" 
        :key="key"
        :id="key"
        v-html="part"
        @contextmenu.prevent.stop="showContextMenu($event, key)"
        >
    </div>
    <vFooter />
    <vue-simple-context-menu
        element-id="page-context"
        :options="menuItems"
        ref="pageContextMenu"
        @option-clicked="optionClicked"
    />
</main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { onKeyStroke, onKeyUp} from "@vueuse/core";
import {Flow} from "../modules/reactives";
import {startReading, identifySpeechTarget, stopReading} from "./tts/TTS.js";
import vHeader from "./Header.vue"
import vFooter from "./Footer.vue"
import WelcomePage from "./WelcomePage.vue"
let amount = 0;
const 
    text = ref(null),
    pageContextMenu = ref(null)
;

const pageMode = {
    amount : 0,
    pages : 0,
    move(n) {
    if (n == 0)
            return
        
        text.value.scrollBy(0, amount * n)

        this.pages += n
    }
}
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
        cb() {}
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

function showContextMenu(e, item) {
    pageContextMenu.value.showMenu(e, item);
}

onKeyUp("ArrowRight", e=> {
    pageMode.move()
})

onKeyUp("ArrowLeft", e=> {
    pageMode.move(-1)
})

onMounted(() => {
    pageMode.amount = document.documentElement.clientHeight
})
</script>

<style lang='sass' scoped>

main
    display: flex
    flex-direction: column
    flex: 1
    align-items: center

    font-size: 2rem
    overflow-y: auto
    overflow-x: hidden

    @media screen and (hover: none) and (max-width: 1280px) 
        font-size: smaller
    
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