<template>
    <BaseActions>
        <LibraryBtn @click="setLibrary" />
    </BaseActions>
    <VListing v-if="library" :sorter="librarian" :fs="library" @open-book="loadBook" />
</template>
<script setup lang=ts>
import { db } from 'src/db/dexie';
import { onBeforeMount, watch } from 'vue';
import BaseActions from './BaseActions.vue';
import { loadBook } from './fileReader';
import { settings_id } from "src/settings/settings_id";
import LibraryBtn from './LibraryBtn.vue';
import VListing from './Listing.vue';
import { library } from '.';
import { createFS } from 'src/fs/prepFS';
import { asDir } from 'src/fs/tauri';
import { librarian } from 'src/fs/prepLibrarian';
import { open } from '@tauri-apps/plugin-dialog';
import { readDir, } from "@tauri-apps/plugin-fs"

watch(() => library.value?.root, rootDir => {
    if (rootDir === undefined)
        return;

    console.log(rootDir);
    db.settings.put({
        id: settings_id,
        tauriDir: rootDir.name,
    })
    librarian.sort(rootDir);
})
async function setLibrary() {
    const libraryRootPath = await open({ 
        directory: true, 
        title: "Pick a library directory", 
        recursive:true
    })
    loadRoot(libraryRootPath!)
}

async function loadRoot(path?: string|null) {
    if (path) {
        const children = await readDir(path, {recursive:true})
        library.value = await createFS(asDir({
            path,
            name: path,
            children,
        }));
    }
}
onBeforeMount(async () => {
    if (library.value == undefined) {
        const s = await db.settings.get(settings_id);
        loadRoot(s?.tauriDir)
    }
})
</script>
