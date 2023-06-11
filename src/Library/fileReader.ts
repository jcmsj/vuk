import { TOC } from "../TOC";
import { useTitle } from "@vueuse/core";
import { Enhanced } from "../lib/EnhancedEpub";
import { loadMethod, LoadMethod } from "./Load";
import { book, load, toManifestID } from "../Bookmarks/useBook";
import { toHome } from "../layouts/Tab";
import { ProgressEvents } from "@jcsj/epub/lib/Parts";
import DevMode from "../settings/DevMode";
import { Item } from "../fs";

const withLogs: ProgressEvents = {
    async root() {
        TOC.items.clear()
    },
    async metadata(metadata) {
        console.log("Meta:", metadata);
        useTitle(metadata.title)
    },
    manifest(manifest) {
        console.log("manifest: ", manifest);
    },
    spine(spine) {
        console.log("spine:", spine);
    },
    flow(flow) {
        console.log("Flow: ", flow);
    },
    toc(toc) {
        console.log("TOC: ", toc);
        TOC.items = toc
    }
}

const noLogs: ProgressEvents = {
    async root() {
        TOC.items.clear()
    },
    async metadata(metadata) {
        useTitle(metadata.title)
    },
    toc(toc) {
        TOC.items = toc
    }
}
export async function loadBookFromFile(anEpub: File) {
    const epub = await Enhanced({
        blob: anEpub,
        events: DevMode.value ? withLogs : noLogs
    })
    if (epub.parts.metadata.title) {
        await load(epub.parts.metadata.title || "");
    }
    switch (loadMethod.value) {
        case LoadMethod.lazy:
            let index = 0;
            const tail = book.bookmarks[book.bookmarks.length - 1];
            //else new book
            if (tail) {
                const id = toManifestID(tail);
                const [i] = epub.parts.flow.pairOf(id)
                index = Math.max(i, index)
            }
            await epub.between({ index })
            break;
        default:
            epub.loadAll()
    }

    toHome()
}
export async function loadBook(item:Item) {
    await loadBookFromFile(
        await item.get()
    )
}
export async function loadBookFromHandle(h: FileSystemFileHandle) {
    await loadBookFromFile(
        await h.getFile()
    )
}