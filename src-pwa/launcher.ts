import { isSupported } from "./hasPWAFileHandlingAPI";
import { loadBookFromHandle } from "../src/Library/fileReader"
/**
 * @PWA
 */
export async function loadBookFromLauncher() {
    if (!isSupported()) {
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