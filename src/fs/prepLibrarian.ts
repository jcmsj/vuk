import { Dir, Library } from ".";

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