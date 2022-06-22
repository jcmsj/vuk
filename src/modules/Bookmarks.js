import { reactiveMap } from "./reactives";
import { get, set } from "idb-keyval"
import { idb_prefixes } from "../components/idb";
import { setSpeechTarget, isReadable } from "../components/tts/TTS";
import generateSelector from "./generateSelector"
import { getReadingProgress } from "./useMainElem";

export const Bookmarks = reactiveMap()

export class BookmarkController {
    static className = "bookmark"
    static auto = {
        read: null,
        scroll: null
    }

    static charPreview = 20;

    static create(selector, text, percentage = 0) {
        return {
            selector,
            text : text.replace('"', "\""),
            percentage
        }
    }

    static from(elem, percentage = getReadingProgress()) {
        const reap = () =>  {
            switch(elem.tagName) {
                case "IMG":
                    return elem.alt
                default:
                    return elem.innerText.slice(0, this.charPreview)
            }
        }
        return this.create(
            generateSelector(elem, document.querySelector("#app")),
            reap(),
            percentage
        )
    }

    static clone(proxy) {
        return this.create(proxy.selector, proxy.text, proxy.percentage);
    }

    /**
     * @param {HTMLElement} elem 
     */
    static mark(elem) {
        return {
            exists: elem.classList.contains(this.className),
            bookmark: this.from(elem)
        }
    }

    /**
     * 
     * @param {String} selector 
     */
    static unmark(selector) {
        const elem = document.querySelector(selector)
        if (elem instanceof HTMLElement
            && elem.classList instanceof DOMTokenList) {
            elem.classList.remove(this.className)
        }

        Bookmarks.items.delete(selector)
        this.sync()
    }

    static toggle(elem, percentage = 0) {
        const { exists, bookmark } = this.mark(elem, percentage);

        if (exists) {
            this.unmark(bookmark.selector)
            return false;
        }

        elem.classList.add(this.className)
        Bookmarks.items.set(bookmark.selector, bookmark);
        this.sync()
        return true
    }

    static async load() {
        const items = await get(idb_prefixes.bookmark + document.title)
        if (!(items instanceof Object))
            return

        Bookmarks.items = new Map()
        for (const [key, bookmark] of Object.entries(items)) {
            Bookmarks.items.set(key, bookmark)
        }
    }

    static sync() {
        const serialized = {}
        for (const [key, bookmark] of Bookmarks.items) {
            //Since Vue uses proxy objects, the real objects need to be recreated.
            serialized[key] = this.clone(bookmark)
        }

        this.setOrLog(
            idb_prefixes.bookmark + document.title,
            serialized
        )
    }

    static saveProgress(elem, percentage = 0) {
        const { bookmark } = this.mark(elem, percentage);

        this.setOrLog(
            idb_prefixes.bookmark + idb_prefixes.auto + document.title,
            bookmark
        )
    }

    static async loadProgress() {
        let p = null;
        try {
            p = await get(idb_prefixes.bookmark + idb_prefixes.auto + document.title)
        } catch (e) {
            console.log(e);
        }

        return p;
    }

    /**
     * Set a value with a key.
     * @param key
     * @param value
     * @param customStore Method to get a custom store. Use with caution (see the docs).
     */
    static async setOrLog(key, value, customeStore = undefined) {
        try {
            set(key, value, customeStore)
        } catch (e) {
            console.log(e);
        }
    }

    /**
    * @returns whether there are no bookmarks.
    * TODO: Sort the bookmarks by the progress(percentage).
    */
    static async reapply() {
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
        for (const bm of [await this.loadProgress(), ...Bookmarks.items.values()]) {
            const elem = bm ? restore(bm.selector) : null;

            if (elem == null)
                continue

            if (!latest || bm.percentage > latest.percentage) {
                latest = bm;
                if (isReadable(elem))
                    readable = elem;
            }
        }

        const refocus = lem => lem.scrollIntoView({ block: "start" })

        if (setSpeechTarget(readable)) {
            refocus(readable)
        } else if (latest) {
            refocus(latest)
        }

        return !latest;
    }
}