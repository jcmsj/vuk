<template>
    <ol>
        <b class="tab-label">Bookmarks</b>
        <li
            v-for="[key, previewText] of Bookmarks.items"
            :key="key"
            class="bookmark-link"
            @click="focus(key)"
            @dblclick="Bookmarks.unMark(key)"
            :title="key"
        >
        {{previewText}}
        </li>
    </ol>
</template>
<script setup>
import { Bookmarks } from '../../modules/Bookmark';
function focus(selector) {
    const elem = document.querySelector(selector);
    if (elem instanceof HTMLElement)
        elem.scrollIntoView()
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