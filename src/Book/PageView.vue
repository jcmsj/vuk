<template>
    <lazy-loader>
        <div @mouseup="target.identify" id="__live" ref="view" @click="anchorClicked">
            <v-page v-for="page in pages" :page="page" />
            <context-menu />
        </div>
    </lazy-loader>
</template>
<script setup lang="ts">

import { anchorClicked } from "../Library/anchorClicked"
import { setWalker, target } from "./Target";
import { view, pages } from "./Pages"
import ContextMenu from "./ContextMenu.vue";
import LazyLoader from "./LazyLoader.vue";
import VPage from "./VPage.vue";
import { reapply } from "src/Bookmarks/useBook";
import { refocus } from "src/lib/helpers";
import { watch } from "vue";

watch(pages, async() => {
    if (!view.value) return;

    // Focus the middle element, as it is the actual page that was loaded.
    // Since we only load 3 pages in lazy mode, it's hardcoded for now
    if (view.value.childElementCount == 3) {
        refocus(view.value.firstElementChild?.nextElementSibling!)
    }

    setWalker(view.value);
    const maybeLatest = await reapply()
    if (maybeLatest) {
        target.override(maybeLatest.elem);
        refocus(maybeLatest.elem)
    }
})

</script>
<style lang='sass' scoped>
    
#__live 
    flex: 1
    margin: 1vh 1vw
</style>
