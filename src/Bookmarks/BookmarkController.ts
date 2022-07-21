import { get, set } from "idb-keyval"
import { idb_prefixes } from "../modules/idb";
import generateSelector from "../modules/generateSelector"
import { getReadingProgress } from "../modules/useMainElem";
import Bookmarks from "./Bookmarks";
import { narrator } from "../TTS/Narrator";
import { Bookmark } from "./Bookmark";

interface Latest {
    bm:Bookmark,
    elem:HTMLElement
}

type MaybeLatest = Latest|undefined;

function getPreview(elem:HTMLElement|HTMLImageElement, upTo:number) {
    let t = elem.innerText;
    if (elem instanceof HTMLImageElement) {
        t = elem.alt
    }

    return t.slice(0, upTo)
}

function determineLatest(items:Bookmark[], querier:(selector:string) => Element|null) {
    return items.reduce<MaybeLatest>((it:MaybeLatest, bm:Bookmark) => {
        const elem = querier(bm.selector)
        if (elem == null)
            return it;

        if (!it || bm.percentage > it.bm.percentage) {
            return {bm, elem: elem as HTMLElement}
        }
        return it
    }, 
    undefined);
}

function queryElementAndAddClass(selector:string, classname:string) {
    const lem = document.querySelector(selector)

    if (lem) {
        if (lem.classList)
            lem.classList.add(classname)
        else
            lem.className = classname
    }

    return lem
}

export class BookmarkController {
    static className = "bookmark"
    static auto = {
        read: null,
        scroll: null
    }

    static charPreview = 20;

    static create(selector:string, text:string, percentage = 0):Bookmark   {
        return {
            selector,
            text : text.replace('"', "\""),
            percentage
        }
    }

    static from(elem:HTMLElement|HTMLImageElement, percentage = getReadingProgress()) {
        return this.create(
            generateSelector(elem, document.querySelector("#app")),
            getPreview(elem, this.charPreview),
            percentage
        )
    }

    static clone(proxy:Bookmark) {
        return this.create(proxy.selector, proxy.text, proxy.percentage);
    }

    static mark(elem:HTMLElement, percentage?:number) {
        return {
            exists: elem.classList.contains(this.className),
            bookmark: this.from(elem, percentage)
        }
    }

    static unmark(selector:string) {
        const elem = document.querySelector(selector)
        if (elem instanceof HTMLElement
            && elem.classList instanceof DOMTokenList) {
            elem.classList.remove(this.className)
        }

        Bookmarks.items.delete(selector)
        this.sync()
    }

    static toggle(elem:HTMLElement, percentage?:number) {
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
        const items = await get<{[key:string]:Bookmark}>(idb_prefixes.bookmark + document.title) || {}
        Bookmarks.items.clear()
        for (const [k, bm] of Object.entries(items)) {
            Bookmarks.items.set(k, bm)
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

    static saveProgress(elem?:HTMLElement|null, percentage?:number) {
        if (!elem)
            throw TypeError("Unable to save progress.");
            
        const { bookmark } = this.mark(elem, percentage);

        this.setOrLog(
            idb_prefixes.bookmark + idb_prefixes.auto + document.title,
            bookmark
        )
    }

    static async loadProgress() {
        return get<Bookmark>(idb_prefixes.bookmark + idb_prefixes.auto + document.title);
    }

    /**
     * Set a value with a key or logs an error.
     */
    static async setOrLog(key:string, value:any, customeStore = undefined) {
        set(key, value, customeStore)
        .catch(console.log)
    }

    static restore(selector:string) {
        return queryElementAndAddClass(selector, this.className)
    }
    /**
    * @returns whether there are no bookmarks.
    */
    static async reapply(): Promise<boolean> {
        const items = [...Bookmarks.items.values()];
        const prog =await this.loadProgress();
        if (prog)
            items.push(prog);

        const maybeLatest = determineLatest(items, this.restore.bind(this))

        if (maybeLatest)
            narrator.override(maybeLatest.elem);

        return !maybeLatest;
    }

    static toManifestID(bm:Bookmark) {
        return bm.selector.split(" > ", 1)[0].substring(1);
    }
}

export default BookmarkController