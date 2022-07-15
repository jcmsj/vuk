import {TOC} from "../TOC";
import { reset } from "../TTS";
import {Bookmarks, BookmarkController} from "../Bookmarks"
import { useTitle } from "@vueuse/core";
import {EnhancedEpub} from "../modules/EnhancedEpub";
import { loadMethod, LoadMethod } from "./Load";
export async function loadBookFromFile(anEpub:File) {
    const epub = new EnhancedEpub(anEpub)

    Bookmarks.items.clear()
    TOC.items.clear()
    reset()
    epub.open({
        root: async() => epub.parseRootFile(epub.rootXML),
        metadata: async() => {
            console.log("Meta:", epub.metadata);
            useTitle(epub.metadata.title)
            await BookmarkController.load();
            switch(loadMethod.value) {
                case LoadMethod.lazy:
                    let index = 0;
                    if (!Bookmarks.isEmpty()) { // New book
                        const [, tail] = Bookmarks.at(Bookmarks.items.size - 1)
                        const id = BookmarkController.toManifestID(tail);
        
                        let [i] = epub.flow.pairOf(id)
                        if (i) 
                            index = i < 0 ? 0:i;
                    }
                    epub.between({index})
                break;
                default:
                    epub.loadAll()
            }
        },
        manifest: () => {
            console.log("manifest: ", epub.manifest);
        },
        spine:() => {
            console.log("spine:", epub.spine);
        },
        flow: () => {
            console.log("Flow: ", epub.flow);
        },
        toc:  () => {
            console.log("TOC: ", epub.toc);
                TOC.items = epub.toc
        }
    })
}

export async function loadBookFromHandle(h:FileSystemFileHandle) {
    await loadBookFromFile(
        await h.getFile()
    )
}

/**
 * @PWA
 */
export async function loadBookFromLauncher() {
    if (!("launchQueue" in window && "files" in LaunchParams.prototype))  {
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