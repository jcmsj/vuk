import { TOC } from "../TOC";
import { BookmarkController } from "../Bookmarks"
import { useTitle } from "@vueuse/core";
import { Enhanced } from "../lib/EnhancedEpub";
import { loadMethod, LoadMethod } from "./Load";
import { book } from "../Bookmarks/useBook";
import { toHome } from "src/layouts/Tab";

export async function loadBookFromFile(anEpub: File) {
    const epub = await Enhanced({
        blob: anEpub,
        events: {
            async root() {
                TOC.items.clear()
                //epub.parseRootFile(epub.parser.root_xml)
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
    })

    await BookmarkController.load(epub.parts.metadata.title);
    switch (loadMethod.value) {
        case LoadMethod.lazy:
            let index = 0;
            if (book.bookmarks.length) { // New book
                const tail = book.bookmarks[book.bookmarks.length - 1]
                let i = 0;
                if (tail) {
                    const id = BookmarkController.toManifestID(tail);
                    const [_i] = epub.parts.flow.pairOf(id)
                    if (_i) i = _i;
                }

                index = i < 0 ? 0 : i;
            }
            epub.between({ index })
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