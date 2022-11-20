import { Book, db } from "../db/dexie";
import { reactive, toRaw, watch } from "vue";

export const book = reactive<Book>({
    id: -1,
    title: "Vuk",
    bookmarks: [],
});

//Watch len instead of the array itself
watch(() => book.bookmarks.length, len => {
    console.log(book.id, len, book.bookmarks);
    db.books.update(book.id!, { bookmarks: book.bookmarks.map(toRaw) });
});

watch(() => book.auto, auto => {
    if (auto)
        db.books.update(book.id!, { auto: toRaw(auto) })
})