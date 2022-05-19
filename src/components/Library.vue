<template>
<div class="r"> 
    <div
        class="btn"
        @click="selectFile"
    >Open epub
    </div>
    <div
        class="btn"
        @click="setLibrary"
    >
        Set Library
    </div>
    <div
        class="btn"
        @click="restoreLibrary"
        >
        Restore Library
    </div>
    <div class="directory" v-if="hRoot && hRoot != hCurrent" @click="traverse(hRoot)">/</div>
    <div class="directory" v-if="levels.length" @click="moveUp">../</div>
    <div class="directory" v-for="(handle, dirname) of dirs" 
        :key="dirname"
        @click="traverse(handle)"
    >
        {{dirname}}
    </div>
    <div class="book" v-for="(handle, name) of books" 
        :key="name" 
        @click="loadBookFromHandle(handle)">
        {{name}}
    </div>
</div>
</template>
<script setup>
import { ref } from "vue"
import {onKeyUp, useTitle} from "@vueuse/core"
import {directoryOpen, fileOpen} from "browser-fs-access"
  
import EnhancedEpub from "../modules/EnhancedEpub.js";

import {get, set, clear} from "idb-keyval"
const title = useTitle()

//Refs
const 
    books = ref({}),
    dirs = ref({}),
    hCurrent = ref(null),
    hRoot = ref(null),
    levels = ref([])
;

/**
 * @param {FileSystemFileHandle} handle 
 */
async function loadBookFromHandle(handle) {
    await loadBookFromFile(
        await handle.getFile()
    )
}

async function selectFile() {
    const file = await fileOpen({
        mimeTypes: ['application/epub+zip'],
    });
    loadBookFromFile(file);
}
/**
 * @param {File} file
 */
async function loadBookFromFile(file, cached = false) {
    const epub = new EnhancedEpub(file)
    epub.open()

    epub.on("parsed-root", async() => {
        epub.parseRootFile(epub.rootXML)
    })

    epub.on("parsed-manifest", async() => {
      console.log("Manifest: ", epub.manifest);
    })

    epub.on("parsed-spine", async() => {
      console.log("Flow: ", epub.flow);
    })

    epub.on("parsed-toc", async() => {
        //Todo: Draw to sidebar
        console.log("TOC: ", epub.toc);
        console.log("Spine: ", epub.spine);
    })

   epub.on("parsed-metadata", async() => {

    })

  epub.on("loaded", async() => {
    title.value = epub.metadata.title
  })

}


async function setLibrary() {
    let directoryHandle = null;
    try {
        [{directoryHandle}] = await directoryOpen();
    } catch (e) {
        console.log(e);
        return
    }

    if (!directoryHandle)
        return

    set("last-working-dir", directoryHandle).then(() => {
        restoreLibrary()
    })
}

function setRootDir(dirHandle) {
    if (dirHandle == null) {
        return
    }

    hRoot.value = dirHandle
    return dirHandle
}

function getRootDir() {
    return hRoot.value
}

async function getLastWorkingDir() {
    const handle = await get("last-working-dir");

    if (await verifyPermission(handle, "read")) {
        return handle
    }

    return null;
}

async function restoreLibrary() {
    if (getRootDir() != null) {
        return
    }

    setCurrentDir(
        setRootDir(await getLastWorkingDir())
    )
}

onKeyUp("f", e=> {
    restoreLibrary();
}, {target:document})
/**
 * @param {FileSystemDirectoryHandle} dirHandle
 */
async function traverse(dirHandle) {
    if (dirHandle == undefined || dirHandle == null) {
        dirHandle = hRoot.value
    }

    if (await dirHandle.isSameEntry(hCurrent.value)) {
        return
    }

    if (await hRoot.value.isSameEntry(dirHandle)) {
        levels.value = [];
    } else {
        levels.value.push(hCurrent.value);
    }
    setCurrentDir(dirHandle)
}

async function moveUp() {
    setCurrentDir(levels.value.pop())
}

async function setCurrentDir(dirHandle) {
    hCurrent.value = dirHandle
    sortDir();
}

//The template shows a live view of the contents
async function sortDir() {
    books.value = {} //reset
    dirs.value = {}
    try {
        for await (const [key, h] of hCurrent.value.entries()) {
            if (h.kind == "file") {
                const file = await h.getFile()
                if (file.type == "application/epub+zip")
                    books.value[key] = h
            } else {
                dirs.value[key] = h
            }
        }
    } catch (e) {
        console.log(e);
        return
    }
}

async function verifyPermission(handle, mode = "read") {
    const options = {};
    options.mode = mode;
    const g = "granted"
    // Check if permission was already granted.
    if ((await handle.queryPermission(options)) === g) {
        return true;
    }
    // Request permission.
    if ((await handle.requestPermission(options)) === g) {
        return true;
    }
    // The user didn't grant permission.
    alert("Please allow the e-reader to READ the contents of the directory.")
    console.log("Failed to get directory permission");
    return false;
}

</script>
<style lang='sass' scoped>
    .book, .directory, .btn
        cursor: pointer
        
    .directory::before
        content: "\01F4C2 "

    .book::before
        content: "📖 "
</style>