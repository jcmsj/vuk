<template>
    <q-list>
        <q-item-label header>
            Bookmarks
        </q-item-label>
        <q-item 
            clickable 
            v-for="bm of book?.bookmarks" 
            :key="bm.selector"
            @click="focus(bm.selector, bm)" @dblclick="BookmarkController.unmark(bm)" :title="bm.selector"
        >
            {{ bm.text }} - {{ bm.percentage }}%
        </q-item>
    </q-list>
</template>
<script setup lang="ts">
import { Bookmark } from "./Bookmark";
import { BookmarkController, clone } from './BookmarkController';
import { EnhancedEpub } from "../lib/EnhancedEpub";
import { refocus } from "../lib/helpers"
import { book } from "./useBook";
import { watch } from "vue";
import { db } from "../db/dexie"

//Watch len instead of the array itself
watch(() => book.bookmarks.length, len => {
    console.log(book.id, len, book.bookmarks);
    db.books.update(book.id!, { bookmarks: book.bookmarks.map(clone) });
});

watch(() => book.auto, auto => {
    if (auto)
        db.books.update(book.id!, { auto: clone(auto) })
})
async function focus(selector: string, bm: Bookmark) {
    let maybeElem = document.querySelector(selector);

    if (maybeElem) {
        refocus(maybeElem)
        return;
    } else {
        const success = await EnhancedEpub.instance!.between({ id: BookmarkController.toManifestID(bm) })

        console.log(success ? "Bookmark clicked:" : "Invalid", selector);
    }

    BookmarkController.reapply()
}
</script>
<style lang='sass'>
.bookmark
    border: 1px solid green

</style>
<style lang="sass" scoped>
ol
    padding-inline-start: 2vw
</style>