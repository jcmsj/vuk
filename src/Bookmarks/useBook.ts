import { Book, db } from "../db/dexie";
import { reactive, toRaw } from "vue";
import generateSelector from "@jcsj/generate-selector";
import mainElem, { getReadingProgress } from "src/lib/useMainElem";
import { Bookmark } from "./";

export interface Latest {
    bm: Bookmark,
    elem: HTMLElement
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
});

export default book;

export async function load(title: string) {
    book.title = title;
    const _book: Book | undefined = await db.books.get({ title }) || undefined;
    if (_book) {
        // Restore
        Object.assign(book, _book);
    } else {
        // Create new entry
        book.bookmarks = [];
        book.id = undefined;
        book.id = await db.books.add(toRaw(book)) as number;
    }
}
export function saveProgress(elem?: HTMLElement | null, percentage?: number) {
    if (!(elem instanceof Element))
        throw TypeError("Not an element.");

    book.auto = mark(elem, percentage).bookmark;
}

/**
* @returns The latest between a bookmark or TTS reading position if there are any.
*/
export async function reapply(): Promise<Latest | undefined> {
    const items = [...book.bookmarks.values()];
    if (book.auto)
        items.push(toRaw(book.auto));

    return addClassThenDetermineLatest((items))
}

const addClassThenDetermineLatest = determineLatest(addClassForElement(constants.className));

export function getPreview(elem: HTMLElement | HTMLImageElement, upTo: number) {
    let t = elem instanceof HTMLImageElement
        ? elem.alt
        : elem.innerText;

    return t.slice(0, upTo)
}

export function determineLatest(querier: (selector: string) => Element | null) {
    return (items: Bookmark[]) => {
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

}
export function addClassForElement(className: string) {
    return (selector: string) => {
        const lem = document.querySelector(selector)

        if (lem) {
            if (lem.classList)
                lem.classList.add(className)
            else
                lem.className = className
        }

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
    if (elem instanceof HTMLElement
        && elem.classList instanceof DOMTokenList) {
        elem.classList.remove(constants.className)
    }
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
