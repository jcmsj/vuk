<template>
<div >
    <div @click="addLibrary">Set Library</div>
    <div @click="getRootDir">Restore Library</div>
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

</template>
<script setup>
import { onMounted, ref } from "vue"
import {get, set, getMany, entries, clear} from "idb-keyval"

const emits = defineEmits(["continue-reading", "load-book"])

const rootDirHandle = ref(null),
    curDirHandle = ref(null),
    items = ref({}),
    books = ref({}),
    dirs = ref({});

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
    set(handle.name, handle).then(() => {
        getRootDir()
    })
}

async function getRootDir() {
    entries().then(async(entries) => {
        if (entries.length == 0) 
            return

        const [[name, handle]] = entries

        if (! (await verifyPermission(handle, "read"))) {
            return
        }

        sortDir(handle)
        rootDirHandle.value = handle
    })
}

async function traverse(dir) {
    
}

async function sortDir(handle) {
    books.value = {} //reset
    dirs.value = {}
    try {
        for await (const [key, h] of handle.entries()) {
            if (h.kind == "file") {
                books.value[key] = h
            } else {
                dirs.value[key] = h
            }
        }
    } catch (e) {
        console.log(e);
    }
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
</style>