import { Book, db } from "../db/dexie";
import { reactive, toRaw } from "vue";
import generateSelector from "@jcsj/generate-selector";
import mainElem, { getReadingProgress } from "src/lib/useMainElem";
import { Bookmark } from "./";

export interface Latest {
    bm: Bookmark,
    elem: Element
}

type MaybeLatest = Latest | undefined;

export const constants = {
    charCount: 20,
    className: "bookmark",
}

export const book = reactive<Book>({
    id: -1,
    title: "Vuk",
    bookmarks: [],
    recentId: 0,
});

export default book;

export async function load(title: string) {
    const _book: Book | undefined = await db.books.get({ title });
    if (_book) {
        // Restore
        Object.assign(book, _book);
    } else {
        // Create new entry
        book.title = title;
        book.bookmarks = [];
        book.id = undefined // Remove link from previously loaded book
        book.id = await db.books.add(toRaw(book)) as number;
    }
}
export function saveProgress(elem?: HTMLElement | null, percentage?: number) {
    if (!(elem instanceof Element))
        throw TypeError("Not an element.");

    book.auto = mark(elem, percentage).bookmark;
}
const addClassThenDetermineLatest = determineLatest(addClassForElement(constants.className));

/**
* @returns The latest between a bookmark or TTS reading position if there are any.
*/
export async function reapply(): Promise<Latest | undefined> {
    const items = [...book.bookmarks.values()];
    if (book.auto)
        items.push(toRaw(book.auto));

    return addClassThenDetermineLatest(items)
}

export function getPreview(elem: HTMLElement | HTMLImageElement, upTo: number) {
    let t = elem instanceof HTMLImageElement
        ? elem.alt
        : elem.innerText;

    return t.slice(0, upTo)
}

type Querier = (selector: string) => Element | null;
export function determineLatest(querier: Querier) {
    return (items: Bookmark[]): MaybeLatest => {
        const it = items.reduce<Bookmark | null>((latest, bm) => {
            return !latest || bm.percentage > latest.percentage ?
                bm : latest;
        }, null);
        const elem = it ? querier(it.selector) : null;
        return elem ? { bm: it!, elem } : undefined;
    }
}
export function addClassForElement(className: string) {
    return (selector: string) => {
        const lem = document.querySelector(selector)
        lem?.classList.add(className)
        return lem
    }
}

export function make(selector: string, text: string, percentage = 0): Bookmark {
    return {
        selector,
        text: text.replace('"', "\""),
        percentage
    }
}

export function from(
    elem: HTMLElement | HTMLImageElement,
    percentage = getReadingProgress(),
    charCount = 20) {
    return make(
        generateSelector(elem, mainElem.value),
        getPreview(elem, charCount),
        percentage
    )
}

export function toManifestID(bm: Bookmark) {
    return bm.selector.split(" > ", 1)[0].substring(1);
}

export function mark(elem: HTMLElement, percentage?: number) {
    return {
        exists: elem.classList?.contains(constants.className),
        bookmark: from(elem, percentage)
    }
}

export function unmark(bookmark: Bookmark) {
    const elem = document.querySelector(bookmark.selector)
    elem?.classList?.remove(constants.className)
    //expensive
    book.bookmarks = book.bookmarks.filter(bm => bm.selector != bookmark.selector);
}

export async function toggle(elem: HTMLElement, percentage?: number) {
    const { exists, bookmark } = mark(elem, percentage);
    if (exists) {
        unmark(bookmark)
        return false;
    }

    elem.classList.add(constants.className)
    if (book.title) {
        book.bookmarks.push(bookmark)
    }

    return true
}
