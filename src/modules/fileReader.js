import { onBookLoaded } from "../components/tts/TTS";
import {Flow, TOC} from "./reactives";
import { Bookmarks, BookmarkController } from "./Bookmarks"
import { useTitle } from "@vueuse/core";
import { EnhancedMap } from "./Maps";
import { EnhancedEpub } from "./EnhancedEpub";

/**
 * @param {File} file
 */
export async function loadBookFromFile(file, cached = false) {
    const epub = new EnhancedEpub(file)

    Bookmarks.items.clear()
    Flow.items.clear()
    TOC.items.clear()

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

            if (Bookmarks.isEmpty()) { // New book
                this.displayAt(0);
            } else {
                const [, tail] = Bookmarks.at(Bookmarks.items.size - 1)
                const id = BookmarkController.toManifestID(tail);

                let [i,] = this.flow.pairOf(id)
                if (i < 0) {
                    this.displayAt(0)
                } else {
                    this.display(id)
                }

            }
            this.emit("loaded-chapters")
        },
        "loaded-chapters": async function() {
            if (BookmarkController.reapply()) {
                onBookLoaded();
            }
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