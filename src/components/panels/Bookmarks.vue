<template>
    <ol>
        <b>Bookmarks</b>
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
    console.log(selector);
    document.querySelector(selector).scrollIntoView()
}
</script>
<style lang='sass'>
.bookmark
    border: 1px solid green
.bookmark-link
    cursor: pointer
</style>