import { reactiveMap } from "./reactives";
import {Bookmark} from "./Bookmark.ts"
import {get, set} from "idb-keyval"
import { idb_prefixes } from "../components/idb";
import { setSpeechTarget } from "../components/tts/TTS";
export const Bookmarks = reactiveMap({
    className: "bookmark",
    auto : {
        read : null,
        scroll : null
    },
    /**
     * 
     * @param {HTMLElement} elem 
     * @param {Number} percentage 
     * @returns {Bookmark} an altered Bookmark
     */
    _mark(elem, percentage=0) {
        const b = Bookmark.from(elem);

        if (elem.classList.contains(this.className)) {
            Bookmarks.unmark(b.selector);
            return false;
        }
        b.percentage = percentage

        return b
    },
    /**
     * @param {HTMLElement} elem 
     */
    mark(elem, percentage=0) {
        const o = this._mark(elem, percentage);

        if (o == false)
            return false;

        elem.classList.add(this.className)
        Bookmarks.items.set(o.selector, o);
        this.sync()
        return true
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
        
        Bookmarks.items.delete(selector)
        this.sync()
    },
    async load() {
        const items = await get(idb_prefixes.bookmark + document.title)
        if (!(items instanceof Object ))
            return

        this.items = new Map()
        for (const [key, val] of Object.entries(items)) {
            this.items.set(key,  Bookmark.fromObject(val))
        }
    },
    sync() {
        const serialized = {}
        for (const [key, bookmark] of Bookmarks.items) {
            serialized[key] = bookmark.toObject()
        }

        this.setOrLog(
            idb_prefixes.bookmark + document.title, 
            serialized)
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
        const bm = this._mark(elem, percentage);

        if (bm == false) {
            console.error(`Failed to save progress for ${elem}`)
            return
        }

        this.setOrLog(
            idb_prefixes.bookmark + idb_prefixes.auto + document.title,
            bm.toObject()
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
     *
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
        let notBeenSet = true;
        let bookmarks = [...this.items.keys()].reverse() 

        const restore = sel => {
            const lem = document.querySelector(sel)

            if (lem.classList == null)
                lem.className = this.className
            else
                lem.classList.add(this.className)

            return lem
        }

        const refocus = lem => {
            lem.scrollIntoView({block:"start"});
        }
        
        for (const sel of bookmarks){
            const elem = restore(sel)
            if (notBeenSet && setSpeechTarget(elem)) {
                refocus(elem)
                notBeenSet = false;
            }
        }

        const p = await this.loadProgress();

        if (p != null) {
            const last = bookmarks[0];
            if (!last || p.percentage < last.percentage) {
                const elem = restore(p.selector)
                refocus(elem)
            }
        }
        return notBeenSet;
    }
})