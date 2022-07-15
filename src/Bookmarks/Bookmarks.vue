<template>
<div>
    <b class="tab-label">Bookmarks</b>
    <ol>
        <li
            v-for="[key, bm] of Bookmarks.items"
            :key="key"
            class="bookmark-link"
            @click="focus(key, bm)"
            @dblclick="BookmarkController.unmark(key)"
            :title="key"
        >
        {{bm.text}} - {{bm.percentage}}%
        </li>
    </ol>
</div>
</template>
<script setup>
import Bookmarks from "./Bookmarks"
import BookmarkController from './BookmarkController';
import {EnhancedEpub} from "../modules/EnhancedEpub";
import {refocus} from "../modules/helpers"
async function focus(selector, bm) {
    let maybeElem =  document.querySelector(selector);

    if (maybeElem) {
        refocus(maybeElem)
        return;
    } else {
        const success = await EnhancedEpub.instance.between({id:BookmarkController.toManifestID(bm)})

        console.log(success ? "Bookmark clicked:":"Invalid", selector);
    }

    BookmarkController.reapply()
}
</script>
<style lang='sass'>
.bookmark
    border: 1px solid green
.bookmark-link
    cursor: pointer

</style>
<style lang="sass" scoped>
ol
    padding-inline-start: 2vw
</style>