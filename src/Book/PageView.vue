<template>
    <lazy-loader @next="instance?.next()" @prev="instance?.previous()" @stop="instance?.loadAll()">
        <div @mouseup="target.identify($event)" id="__live" ref="view" @click="anchorClicked">
            <v-page v-for="page in pages" v-bind="page" />
            <context-menu />
        </div>
    </lazy-loader>
</template>
<script setup>
// TS STILL DOESNT WORK
import { anchorClicked } from "../Library/anchorClicked"
import { setWalker, target, walker } from "./Target";
import { view, pages } from "./Pages"
import ContextMenu from "./ContextMenu.vue";
import LazyLoader from "./LazyLoader.vue";
import VPage from "./VPage.vue";
import { reapply } from "src/Bookmarks/useBook";
import { refocus } from "src/lib/helpers";
import { watch } from "vue";
import { instance } from "src/lib/EnhancedEpub";
import { log } from "src/settings/DevMode";
watch(pages, async () => {
    const v = view.value
    if (!v) return
    log("pages changed");

    // Focus the middle element, as it is the actual page that was loaded.
    // Since we only load 3 pages in lazy mode, it's hardcoded for now
    if (v?.childElementCount == 3) {
        refocus(v?.firstElementChild?.nextElementSibling)
    }
    setWalker(v);
    const maybeLatest = await reapply()
    // Latest bookmark or last page's first element
    const elem = maybeLatest?.elem ?? up().firstElementChild
    if (elem instanceof HTMLElement) {
        target.override(elem)
        refocus(elem)
    } else {
        log("[TTS]: no elem");
    }

    // https://vuejs.org/guide/essentials/watchers.html#callback-flush-timing
}, {flush: "post"})

function up() {
    while (walker.value.currentNode instanceof Text) {
        walker.value.nextNode()
    }
    log("L", walker.value.currentNode)
    return walker.value.currentNode
}
</script>
<style lang='sass' scoped>
    
#__live 
    flex: 1
    margin: 1vh 1vw
</style>
