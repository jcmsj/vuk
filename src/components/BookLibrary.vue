<template>
<div >
    <div @click="addLibrary">Set Library</div>
    <div @click="getRootDir">Restore Library</div>
    <div class="scrollable">
        <div v-if="hRoot" @click="traverse(hRoot)">
            &#128193; /
        </div>
        <div v-if="hPrev" @click="traverse(hPrev)">
            &#128193; ../
        </div>
        <div v-for="(handle, dirname) of dirs" 
            :key="dirname"
            @click="traverse(handle)"
        >
            &#128193; {{dirname}}
        </div>
        <div v-for="(handle, name) of books" 
            :key="name" 
            @click="loadBookFromHandle(handle)">
                📖 {{name}}
        </div>
    </div>
</div>

</template>
<script setup>
import { ref } from "vue"
import {get, set, getMany, entries, clear} from "idb-keyval"

const emits = defineEmits(["continue-reading", "load-book"])
const 
    items = ref({}),
    books = ref({}),
    dirs = ref({}),
    hCurrent = ref(null),
    hPrev = ref(null),
    hRoot = ref(null)

async function isInRoot() {
    return await hRoot.value.isSameEntry(hCurrent.value)
}

function continueReading(title) {
    emits("continue-reading", title)
}

function loadBookFromHandle(handle) {
    emits("load-book", handle)
}

/**
 * Todo: Display multiple root directories
 */
async function addLibrary() {
    let handle;
    try {
        handle = await window.showDirectoryPicker()
    } catch (e) {
        return
    }

    set("last-working-dir", handle).then(() => {
        getRootDir()
    })
}

async function getRootDir() {
    const handle = await get("last-working-dir");

    if (! (await verifyPermission(handle, "read"))) {
        return
    }

    sortDir(handle)
    hRoot.value = handle
}

/**
 * @param {FileSystemDirectoryHandle} dirHandle
 */
async function traverse(dirHandle) {
    if (await hCurrent.value.isSameEntry(dirHandle)) {
        return
    }

    console.log("Traverse: " , dirHandle);

    sortDir(dirHandle)
}

async function sortDir(handle) {
    books.value = {} //reset
    dirs.value = {}
    try {
        for await (const [key, h] of handle.entries()) {
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
    hPrev.value = hCurrent.value;
    hCurrent.value = handle
}

async function verifyPermission(handle, mode = "read") {
    console.log("H", handle);
    const options = {};
    options.mode = mode;
    // Check if permission was already granted. If so, return true.
    if ((await handle.queryPermission(options)) === 'granted') {
        return true;
    }
    // Request permission. If the user grants permission, return true.
    if ((await handle.requestPermission(options)) === 'granted') {
        return true;
    }
    // The user didn't grant permission, so return false.
    return false;
}

</script>
<style lang='sass'>
    div
        cursor: pointer

    .scrollable
        scroll-behavior: scroll
</style>