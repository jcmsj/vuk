import { Dir, HandleKind, Librarian, Library } from ".";
import { reactive } from "vue";

export async function sort(dir: Dir): Promise<Library> {
    const books: Library["books"] = {},
        dirs: Library["dirs"] = {};
    for await (const h of dir.entries()) {
        if (h.kind === HandleKind.FILE) {
            books[h.name] = h
        } else {
            dirs[h.name] = h
        }
    }
    return { books, dirs };
}

export function prepLibrarian(sort: (dir: Dir) => Promise<Library>) {
    return {
        dirs: {},
        books: {},
        async sort(dir: Dir) {
            const pair = await sort(dir);
            this.books = pair.books;
            this.dirs = pair.dirs;
            return this;
        },
    };
}
export const librarian = reactive<Librarian>(prepLibrarian(sort));