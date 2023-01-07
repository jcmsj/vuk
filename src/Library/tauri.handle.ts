import { reactive } from "vue";
import { RxSorter, RxDir } from "./RxDir";
import fs from "@tauri-apps/api/fs"
export const sorter = reactive<RxSorter<fs.FileEntry, fs.FileEntry>>({
    dirs: {},
    books: {},
    async sort(dir) {
        //Sorting is handled in main thread
        console.log(dir);
        
        if (dir.children === undefined) {
            return;
        }
        const books:typeof this.books = {}, //reset
        dirs:typeof this.dirs = {};
        for (const child of dir.children) {
            if (child.name === undefined) {
                continue
            }

            if (child.children) {
                dirs[child.name] = child;
            } else if (child.name?.endsWith(".epub")) {
                books[child.name] = child;
            }
        }
        this.books = books;
        this.dirs = dirs;
    }
})

export const library = reactive<RxDir<fs.FileEntry>>({
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
        if (h) {
            this.levels.push(h);
        }
    },
    async isInRoot() {
        return this.levels.length == 1;
    },
    async isRoot(h) {
        return this.root?.name?.localeCompare(h?.name!) === 0
    }
})