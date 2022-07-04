import Epub from "@jcsj/epub"
import TOC from "../TOC/TOC"
import simplifyHTMLTree from "../modules/simplifyHTMLTree";
import { Bookmarks, BookmarkController } from "../Bookmarks"
import { reset, onEnd, paint } from "../components/Live";
import { useTitle } from "@vueuse/core";

export const book = {
    v : null
}
/**
 * @param {File} file
 */
export async function loadBookFromFile(file) {
    const epub = new Epub(file, simplifyHTMLTree)
    book.v = epub;
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
        "parsed-flow": async function() {
            console.log("Flow: ", this.flow);
            for (const id of this.flow.keys()) {
                paint({
                    id, 
                    html: await this.getContent(id)
                })    
            }

            onEnd()
        },
        "parsed-toc": function() {
            console.log("TOC: ", this.toc);
            TOC.items = this.toc;
        },
        "parsed-metadata": function() {
            console.log("Meta:", this.metadata);
            useTitle(this.metadata.title)
            BookmarkController.load()
        },
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