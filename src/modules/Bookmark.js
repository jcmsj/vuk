import { reactiveMap } from "./reactives";
import generateSelector from "./generateSelector"
import {get, set} from "idb-keyval"
import { idb_prefixes } from "../components/idb";

export const Bookmarks = reactiveMap({
    className: "bookmark",
    charPreview: 20,
    /**
     * 
     * @param {HTMLElement} elem 
     * @param {Number} percentage 
     * @returns an obj of a selector and bookmark text.
     */
    _mark(elem, percentage=0) {
        const selector = generateSelector(elem, document.querySelector("#app"))

        if (elem.classList.contains(this.className)) {
            Bookmarks.unMark(selector);
            return false;
        }

        let text = "";
        switch(elem.tagName) {
            case "IMG":
                text = elem.alt
                break;
            default:
                text = elem.innerText.slice(0, this.charPreview)
        }
        text += ` - ${percentage}%`;

        return {selector,text}
    },
    /**
     * 
     * @param {HTMLElement} elem 
     */
    mark(elem, percentage=0) {
        const o = this._mark(elem, percentage);

        if (o == false)
            return false;

        elem.classList.add(this.className)

        Bookmarks.items.set(o.selector, o.text);
        this.sync()
        return true
    },
    /**
     * 
     * @param {String} selector 
     */
    unMark(selector) {
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
        if (items instanceof Object ) {
            this.items = new Map(Object.entries(items))
        }
    },
    sync() {
        this.setOrLog(
            idb_prefixes.bookmark + document.title, 
            Object.fromEntries(Bookmarks.items));
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
        const o = this._mark(elem, percentage);

        if (o == false) {
            console.error(`Failed to save progress for ${elem}`)
            return
        }

        this.setOrLog(
            idb_prefixes.bookmark + idb_prefixes.auto + document.title,
            o
        )
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

    reapply() {
        let notBeenSet = true;

        for (const k of [...this.items.keys()].reverse()) {
            const elem = document.querySelector(k)
            elem.classList.add("bookmark")
            if (notBeenSet && setSpeechTarget(elem)) {
                elem.scrollIntoView({block:"start"});
                notBeenSet = false;
            }
        }

        return notBeenSet;
    }
})