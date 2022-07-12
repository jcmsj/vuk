import {TOC} from "../TOC";
import { reset } from "../TTS";
import {Bookmarks, BookmarkController} from "../Bookmarks"
import { useTitle } from "@vueuse/core";
import { EnhancedMap} from "../modules/Maps";
import EnhancedEpub from "../modules/EnhancedEpub";
import EV from "@jcsj/epub/EV";
import { loadMethod, LoadMethod } from "./Load";
export async function loadBookFromFile(anEpub:File) {
    const epub = new EnhancedEpub(anEpub)

    Bookmarks.items.clear()
    TOC.items.clear()
    reset()
    const events = new Map<EV, Function>();
    events.set(EV.root, async() => epub.parseRootFile(epub.rootXML));
    events.set(EV.metadata, async() => {
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
                    index = i < 0 ? 0:i;
                }
                epub.between(index)
            break;
            default:
                epub.loadAll()
        }
    })
    events.set(EV.manifest, () => {
        console.log(epub.manifest);
    })
    events.set(EV.spine, () => {
        console.log(epub.spine);
    })
    events.set(EV.flow, () => {
        console.log("Flow: ", epub.flow);
        epub.flow = new EnhancedMap(epub.flow)
    })
    events.set(EV.toc, () => {
        console.log("TOC: ", epub.toc);
            epub.toc = new EnhancedMap(epub.toc)
            TOC.items = epub.toc
    })
  
    epub.open(events)
}

/**
 * @param {FileSystemFileHandle} handle 
 */
export async function loadBookFromHandle(handle) {
    await loadBookFromFile(
        await handle.getFile()
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