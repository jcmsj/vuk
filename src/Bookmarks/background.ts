import { db } from "src/db/dexie";
import { toRaw, watch } from "vue";
import book from "./useBook";
import { log } from "src/settings/DevMode";

/**
 * These watchers should be run from the reader view itself. 
 * Else, the bookmarks won't be autoloaded
*/
//Watch len instead of the array itself
watch(() => book.bookmarks.length, len => {
    log(book.id, len, book.bookmarks);
    db.books.update(book.id!, { bookmarks: book.bookmarks.map(toRaw) });
});

watch(() => book.auto, auto => {
    if (auto)
        db.books.update(book.id!, { auto: toRaw(auto) })
})
