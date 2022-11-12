import { TOC } from "../TOC";
import { BookmarkController } from "../Bookmarks"
import { useTitle } from "@vueuse/core";
import { EnhancedEpub } from "../lib/EnhancedEpub";
import { loadMethod, LoadMethod } from "./Load";
import { book } from "../Bookmarks/useBook";
import router from "src/router";

export async function loadBookFromFile(anEpub: File) {
    const epub = new EnhancedEpub(anEpub)
    TOC.items.clear()
    //reset()
    epub.open({
        async root() {
            epub.parseRootFile(epub.rootXML)
        },
        async metadata() {
            console.log("Meta:", epub.metadata);
            useTitle(epub.metadata.title)
            await BookmarkController.load(epub.metadata.title);
            switch (loadMethod.value) {
                case LoadMethod.lazy:
                    let index = 0;
                    if (book.bookmarks.length) { // New book
                        const tail = book.bookmarks[book.bookmarks.length - 1]
                        let i = 0;
                        if (tail) {
                            const id = BookmarkController.toManifestID(tail);
                            const [_i] = epub.flow.pairOf(id)
                            if(_i) i = _i;
                        }

                        index = i < 0 ? 0 : i;
                    }
                    epub.between({ index })
                    break;
                default:
                    epub.loadAll()
            }
        },
        manifest() {
            console.log("manifest: ", epub.manifest);
        },
        spine() {
            console.log("spine:", epub.spine);
        },
        flow() {
            console.log("Flow: ", epub.flow);
        },
        toc() {
            console.log("TOC: ", epub.toc);
            TOC.items = epub.toc
        }
    })
}

export async function loadBookFromHandle(h: FileSystemFileHandle) {
    await router.push("read")
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