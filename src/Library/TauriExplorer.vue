<template>
    <BaseActions>
        <LibraryBtn @click="setLibrary" />
    </BaseActions>
    <VListing :sorter="sorter" :library="library" @open-book="loadBook" />
</template>
<script setup lang=ts>
import { db } from 'src/db/dexie';
import { readBinaryFile, readDir, FileEntry } from '@tauri-apps/api/fs';
import LibraryBtn from './LibraryBtn.vue';
import VListing from './Listing.vue';
import { open } from "@tauri-apps/api/dialog"
import { loadBookFromFile } from './fileReader';
import BaseActions from './BaseActions.vue';
import { sorter, library } from "./tauri.handle"
import { onBeforeMount, watch } from 'vue';
import { settings_id } from './Handle';
async function loadBook(h: FileEntry) {
    loadBookFromFile(
        new Blob([await readBinaryFile(h.path)]) as File
    );
}

async function setLibrary() {
    let selected = await open({
        directory: true,
        multiple:false,
        recursive: false,
    });

    console.log(selected);
    //Use always the first path provided. May be adjusted to allow multiple roots in the future.
    if (Array.isArray(selected) && selected.length) {
        selected = selected[0]
    } else if (selected === null) {
        return
    }

    library.setRoot(
        await asEntry(selected as string
    ))
}

async function asEntry(pathname: string): Promise<FileEntry> {
    return {
        name: pathname,
        children: await readDir(pathname),
        path: pathname
    }
}
watch(() => library.levels.length, async (s) => {
    console.log(library.levels);
    const last = library.levels[s - 1] ?? library.root;
    //Always refresh children
    last.children = await readDir(last.path)
    library.value = last;
})

watch(() => library.value, async (entry) => {
    console.log(entry);
    if (entry === undefined)
        return;
    sorter.sort(entry)
})
watch(() => library.root, async (rootEntry) => {
    console.log("Root changed:", rootEntry);
    if (rootEntry === undefined) {
        return
    }

    db.settings.put({
        id: settings_id,
        electronDir: rootEntry.path,
        speechRate: 0,
    })
})

onBeforeMount(async () => {
    if (!library.root) {
        const settings = await db.settings.get(settings_id);
        if (settings && settings.electronDir) {
            library.setRoot(
                await asEntry(settings.electronDir)
            )
        }
    }
})
</script>