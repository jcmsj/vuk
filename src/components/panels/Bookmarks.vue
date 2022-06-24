<template>
<div>
    <b class="tab-label">Bookmarks</b>
    <ol>
        <li
            v-for="[key, bm] of Bookmarks.items"
            :key="key"
            class="bookmark-link"
            @click="focus(key)"
            @dblclick="BookmarkController.unmark(key)"
            :title="key"
        >
        {{bm.text}} - {{bm.percentage}}%
        </li>
    </ol>
</div>
</template>
<script setup>
import { Bookmarks, BookmarkController } from '../../modules/Bookmarks';
function focus(selector) {
    const elem = document.querySelector(selector);
    if (elem instanceof HTMLElement)
        elem && elem.scrollIntoView()
    else
        console.warn("Invalid selector:", selector);

    console.log("Bookmark clicked:", selector, elem);
    
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