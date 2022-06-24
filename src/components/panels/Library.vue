<template>
<div class="r"> 
    <button 
        @click="selectFile"
        class="btn"
    >
    Open 📖
    </button>
    <button
        @click="setLibrary"
        class="btn"
    >
    Set 📂
    </button>
    <button
        @click="restoreLibrary"
        class="btn"
    >
    ↻ 📂
    </button>
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
import {onKeyUp} from "@vueuse/core"
import {directoryOpen, fileOpen} from "browser-fs-access"
import {get, set, clear} from "idb-keyval"
import {loadBookFromFile, loadBookFromHandle} from "../../modules/fileReader"
import { idb } from "../idb.js"

//Refs
const 
    books = ref({}),
    dirs = ref({}),
    hCurrent = ref(null),
    hRoot = ref(null),
    levels = ref([])
;

const epubMime = "application/epub+zip";

function getRootDir() {
    return hRoot.value
}

function notADirectoryHandle(h) {
    return !(h instanceof FileSystemDirectoryHandle)
}

async function selectFile() {
    loadBookFromFile(
        await fileOpen({
            mimeTypes: [epubMime],
        })
    );
}

async function setLibrary() {
    let handle = null;
    try {
        [{directoryHandle:handle}] = await directoryOpen();

        if (notADirectoryHandle(handle))
            throw "Not a directory."

    } catch (e) {
        console.log(e);
        return
    }
    
    await set(idb.dir, handle)
    restoreLibrary()
}

function setRootDir(handle) {
    if (notADirectoryHandle(handle))
        return

    hRoot.value = handle
}

async function getLastWorkingDir() {
    const handle = await get(idb.dir);

    if (notADirectoryHandle(handle)) //Maybe a new user
        return

    if (await verifyPermission(handle, "read")) {
        return handle
    }

    alert("Please allow the e-reader to READ the contents of the directory.")
    console.log("Failed to get directory permission");

    return null;
}

async function restoreLibrary() {
    setRootDir(await getLastWorkingDir())
    setCurrentDir(hRoot.value)
}

onKeyUp("f", e=> {
    restoreLibrary();
}, {target:document})
/**
 * @param {FileSystemDirectoryHandle} handle
 */
async function traverse(handle) {
    if (notADirectoryHandle(handle))
        handle = hRoot.value

    if (await handle.isSameEntry(hCurrent.value)) {
        return
    }

    if (await hRoot.value.isSameEntry(handle)) {
        levels.value = [];
    } else {
        levels.value.push(hCurrent.value);
    }
    setCurrentDir(handle)
}

async function moveUp() {
    setCurrentDir(levels.value.pop())
}

async function setCurrentDir(handle) {
    hCurrent.value = handle
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
                if (file.type == epubMime)
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
    return false;
}
</script>
<style lang='sass' scoped>
button
    display: block
    margin: 1vh 1vw
.book, .directory
    cursor: pointer
.directory::before
    content: "\01F4C2 "
.book::before
    content: "📖 "
</style>