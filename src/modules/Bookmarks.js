import { reactiveMap } from "./reactives";
import { Bookmark } from "./Bookmark.ts"
import { get, set } from "idb-keyval"
import { idb_prefixes } from "../components/idb";
import { setSpeechTarget, isReadable } from "../components/tts/TTS";
export const Bookmarks = reactiveMap({
    className: "bookmark",
    auto: {
        read: null,
        scroll: null
    },

    /**
     * @param {HTMLElement} elem 
     */
    mark(elem) {
        return {
            exists: elem.classList.contains(this.className),
            bookmark: Bookmark.from(elem)
        }
    },
    /**
     * 
     * @param {String} selector 
     */
    unmark(selector) {
        const elem = document.querySelector(selector)
        if (elem instanceof HTMLElement
            && elem.classList instanceof DOMTokenList) {
            elem.classList.remove(this.className)
        }

        this.items.delete(selector)
        this.sync()
    },

    toggle(elem, percentage=0) {
        const {exists, bookmark} = this.mark(elem, percentage);

        if (exists) {
            this.unmark(bookmark.selector)
            return false;
        }

        elem.classList.add(this.className)
        this.items.set(bookmark.selector, bookmark);
        this.sync()
        return true
    },
    async load() {
        const items = await get(idb_prefixes.bookmark + document.title)
        if (!(items instanceof Object))
            return

        this.items = new Map()
        for (const [key, bookmark] of Object.entries(items)) {
            this.items.set(key, bookmark)
        }
    },
    sync() {
        const serialized = {}
        for (const [key, bookmark] of Bookmarks.items) {
            //Since Vue uses proxy objects, the real objects need to be recreated.
            serialized[key] = Bookmark.clone(bookmark)
        }

        this.setOrLog(
            idb_prefixes.bookmark + document.title,
            serialized
        )
    },

    get(n) {
        let i = 0
        for (const pair of this.items) {
            if (n == i++) {
                return pair
            }
        }

        return null
    },

    saveProgress(elem, percentage = 0) {
        const {bookmark} = this.mark(elem, percentage);

        this.setOrLog(
            idb_prefixes.bookmark + idb_prefixes.auto + document.title,
            bookmark
        )
    },
    async loadProgress() {
        let p = null;
        try {
            p = await get(idb_prefixes.bookmark + idb_prefixes.auto + document.title)
        } catch (e) {
            console.log(e);
        }

        return p;
    },
    /**
     * Set a value with a key.
     * @param key
     * @param value
     * @param customStore Method to get a custom store. Use with caution (see the docs).
     */
    async setOrLog(key, value, customeStore = undefined) {
        try {
            set(key, value, customeStore)
        } catch (e) {
            console.log(e);
        }
    },

    /**
     * @returns whether there are no bookmarks.
     * TODO: Sort the bookmarks by the progress(percentage).
     */
    async reapply() {
        const restore = sel => {
            const lem = document.querySelector(sel)

            if (lem != null) {
                if (lem.classList)
                    lem.classList.add(this.className)
                else
                    lem.className = this.className
            }

            return lem
        }

        let latest = null;
        let readable = null;
        for (const bm of [await this.loadProgress(), ...this.items.values()]) {
            const elem = bm ? restore(bm.selector):null;

            if (elem == null)
                continue

            if (!latest || bm.percentage > latest.percentage) {
                latest = bm;
                if (isReadable(elem))
                    readable = elem;
            }
        }

        const refocus = lem => lem.scrollIntoView({block: "start"})

        if (setSpeechTarget(readable)) {
            refocus(readable)
        } else if (latest) {
            refocus(latest)
        }

        return !latest;
    }
})