<template>
    <q-list>
        <q-item-label header v-if="book.auto">
            Last Spoken:
        </q-item-label>
        <BookmarkItem v-if="book.auto" :bookmark="book.auto" @click="focus(book.auto)" @dblclick="unmark(book.auto)" />
        <q-separator v-if="book.auto" />
        <q-item-label header>
            Bookmarks
        </q-item-label>
        <BookmarkItem v-for="bm of book?.bookmarks" :key="bm.selector" :bookmark="bm" @click="focus(bm)"
            @dblclick="unmark(bm)" :title="bm.selector" />
    </q-list>
</template>
<script setup lang="ts">
import { Bookmark } from "./";
import { instance } from "../lib/EnhancedEpub";
import { refocus } from "../lib/helpers"
import { unmark, toManifestID } from "./useBook";
import { book, reapply } from "./useBook";
import BookmarkItem from "./BookmarkItem.vue";
async function focus(bm: Bookmark) {
    const maybeElem = document.querySelector(bm.selector);

    if (maybeElem) {
        refocus(maybeElem)
    } else {
        const success = await instance.value!.between({ id: toManifestID(bm) })

        console.log(success ? "Bookmark clicked:" : "Invalid", bm.selector);
        reapply()
    }
}

</script>
<style lang="sass" scoped>
/* Note: bookmark class is in Live.vue */
</style>
