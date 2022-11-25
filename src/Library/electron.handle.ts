import { Dirent } from "fs";
import { reactive } from "vue";
import { RxSorter, RxDir } from "./RxDir";

export const sorter = reactive<RxSorter<Dirent, Dirent>>({
    dirs: {},
    books: {},
    async sort(dir) {
        //Sorting is handled in main thread
        const items = await window.vuk.list(dir.name);
        this.dirs = items.dirs;
        this.books = items.books;
    }
})

export const library = reactive<RxDir<string>>({
    root: undefined,
    levels: [],
    get inRoot() {
        return this.root && this.root === this.value
    },
    value: undefined,
    setRoot(h) {
        this.root = h;
        this.value = h;
    },
    moveUp() {
        this.levels.pop()
    },
    setDir(h) {
        //Unused
    },
    goto(h) {
        if (h && Object.hasOwn(h, "name")) {
            this.levels.push(h.name);
        }
    },
    async isInRoot() {
        return this.levels.length == 1;
    },
    async isRoot(h) {
        return this.root?.localeCompare(h!) === 0
    }
})