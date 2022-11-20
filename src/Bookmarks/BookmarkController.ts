import generateSelector from "generate-selector"
import mainElem, { getReadingProgress } from "../lib/useMainElem";
import { Bookmark } from "./Bookmark";
import { Book, db } from "../db/dexie";
import { book } from "./useBook";
import { EnhancedEpub } from "src/lib/EnhancedEpub";
import { toRaw } from "vue";
interface Latest {
    bm: Bookmark,
    elem: HTMLElement
}

type MaybeLatest = Latest | undefined;

function getPreview(elem: HTMLElement | HTMLImageElement, upTo: number) {
    let t = elem instanceof HTMLImageElement
        ? elem.alt
        : elem.innerText;

    return t.slice(0, upTo)
}

function determineLatest(items: Bookmark[], querier: (selector: string) => Element | null) {
    return items.reduce<MaybeLatest>((it: MaybeLatest, bm: Bookmark) => {
        const elem = querier(bm.selector)
        if (elem
            && (!it || bm.percentage > it.bm.percentage)) {
            return { bm, elem: elem as HTMLElement }
        }
        return it
    },
        undefined);
}

function queryElementAndAddClass(selector: string, classname: string) {
    const lem = document.querySelector(selector)

    if (lem) {
        if (lem.classList)
            lem.classList.add(classname)
        else
            lem.className = classname
    }

    return lem
}

export function create(selector: string, text: string, percentage = 0): Bookmark {
    return {
        selector,
        text: text.replace('"', "\""),
        percentage
    }
}

export class BookmarkController {
    static className = "bookmark"
    static auto = {
        read: null,
        scroll: null
    }

    static charPreview = 20;

    static create(selector: string, text: string, percentage = 0): Bookmark {
        return {
            selector,
            text: text.replace('"', "\""),
            percentage
        }
    }

    static from(elem: HTMLElement | HTMLImageElement, percentage = getReadingProgress()) {
        return create(
            generateSelector(elem, mainElem.value),
            getPreview(elem, this.charPreview),
            percentage
        )
    }

    static mark(elem: HTMLElement, percentage?: number) {
        return {
            exists: elem.classList?.contains(this.className),
            bookmark: this.from(elem, percentage)
        }
    }

    static unmark(bookmark: Bookmark) {
        const elem = document.querySelector(bookmark.selector)
        if (elem instanceof HTMLElement
            && elem.classList instanceof DOMTokenList) {
            elem.classList.remove(this.className)
        }
        //expensive
        book.bookmarks = book.bookmarks.filter(bm => bm.selector != bookmark.selector);
    }

    static async toggle(elem: HTMLElement, percentage?: number) {
        const { exists, bookmark } = this.mark(elem, percentage);

        if (exists) {
            this.unmark(bookmark)
            return false;
        }

        elem.classList.add(this.className)
        if (book.title) {
            book.bookmarks.push(bookmark)
        }

        return true
    }

    static async load(title: string) {
        book.title = title;
        let _book: Book | undefined;
        if (_book = await db.books.get({ title })) {
            //Restore
            book.id = _book.id;
            book.bookmarks = _book.bookmarks;
            book.auto = _book.auto
        } else {
            //Create new entry
            book.bookmarks = [];
            book.id = undefined;
            book.id = await db.books.add(book) as number;
        }
    }

    static saveProgress(elem?: HTMLElement | null, percentage?: number) {
        if (!elem)
            throw TypeError("Not an element.");

        const { bookmark } = this.mark(elem, percentage);
        book.auto = bookmark;
    }

    static restore(selector: string) {
        return queryElementAndAddClass(selector, this.className)
    }

    /**
    * @returns The latest between a bookmark or TTS reading position if there are any.
    */
    static async reapply(): Promise<MaybeLatest> {
        const items = [...book.bookmarks.values()];
        if (book.auto)
            items.push(toRaw(book.auto));

        return determineLatest(items, this.restore.bind(this))
    }

    static toManifestID(bm: Bookmark) {
        return bm.selector.split(" > ", 1)[0].substring(1);
    }
}

export default BookmarkController