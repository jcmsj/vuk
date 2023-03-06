import { TOC } from "../TOC";
import { BookmarkController } from "../Bookmarks"
import { useTitle } from "@vueuse/core";
import { Enhanced } from "../lib/EnhancedEpub";
import { loadMethod, LoadMethod } from "./Load";
import { book } from "../Bookmarks/useBook";
import { toHome } from "src/layouts/Tab";
import { ProgressEvents } from "@jcsj/epub/lib/Parts";
import DevMode from "src/settings/DevMode";

const withLogs:ProgressEvents =  {
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

const noLogs:ProgressEvents = {
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
        events: DevMode.value ? withLogs:noLogs 
    })

    await BookmarkController.load(epub.parts.metadata.title);
    switch (loadMethod.value) {
        case LoadMethod.lazy:
            let index = 0;
            const tail = book.bookmarks[book.bookmarks.length - 1]
            //else new book
            if (tail) {
                const id = BookmarkController.toManifestID(tail);
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

export async function loadBookFromHandle(h: FileSystemFileHandle) {
    await loadBookFromFile(
        await h.getFile()
    )
}

/**
 * @PWA
 */
export async function loadBookFromLauncher() {
    if (!("launchQueue" in window && "files" in LaunchParams.prototype)) {
        console.log("File Handling API is unsupported")
        return
    }

    // The File Handling API is supported.
    launchQueue.setConsumer((launchParams) => {
        // Nothing to do when the queue is empty.
        if (!launchParams.files.length) {
            console.log("No files to be launched!");
            return;
        }
        const [handle] = launchParams.files;
        loadBookFromHandle(handle);
    });
}