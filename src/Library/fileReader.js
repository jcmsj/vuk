import {TOC} from "../TOC";
import { reset } from "../TTS";
import {Bookmarks, BookmarkController} from "../Bookmarks"
import { useTitle } from "@vueuse/core";
import { EnhancedMap} from "../modules/Maps";
import EnhancedEpub from "../modules/EnhancedEpub";
import { loadMethod, LoadMethod } from "./Load";
/**
 * @param {File} file
 */
export async function loadBookFromFile(file) {
    const epub = new EnhancedEpub(file)

    Bookmarks.items.clear()
    TOC.items.clear()
    reset()
    epub.open({
        "parsed-root": async function() {
            this.parseRootFile(this.rootXML)
        },
        "parsed-manifest": function() {
            console.log("Manifest: ", this.manifest);
        },
        "parsed-spine": function() {
            console.log("Spine: ", this.spine);
        },
        "parsed-flow": function() {
            console.log("Flow: ", this.flow);
            this.flow = new EnhancedMap(this.flow)
        },
        "parsed-toc": function() {
            console.log("TOC: ", this.toc);
            this.toc = new EnhancedMap(this.toc)
            TOC.items = this.toc
        },
        "parsed-metadata": async function() {
            console.log("Meta:", this.metadata);
            useTitle(this.metadata.title)
            await BookmarkController.load();
            switch(loadMethod.value) {
                case LoadMethod.lazy:
                    let index = 0;
                    if (!Bookmarks.isEmpty()) { // New book
                        const [, tail] = Bookmarks.at(Bookmarks.items.size - 1)
                        const id = BookmarkController.toManifestID(tail);
        
                        let [i] = this.flow.pairOf(id)
                        index = i < 0 ? 0:i;
                    }
                    this.between(index)
                break;
                case LoadMethod.all:
                    this.loadAll()

                break;
            }
            
            this.emit("loaded-chapters")
        },
        "loaded-chapters": async function() {
        
        }
    })
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
    if (!('launchQueue' in window && 'files' in LaunchParams.prototype))  {
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