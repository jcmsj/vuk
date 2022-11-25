<template>
    <BaseActions>
        <LibraryBtn @click="setLibrary" />
    </BaseActions>
    <VListing :sorter="sorter" :library="library" @open-book="loadBook" />
</template>
<script setup lang=ts>
import { db } from 'src/db/dexie';
import { onBeforeMount, watch } from 'vue';
import BaseActions from './BaseActions.vue';
import { loadBookFromFile } from './fileReader';
import { settings_id } from './Handle';
import LibraryBtn from './LibraryBtn.vue';
import VListing from './Listing.vue';
import { sorter, library } from "./electron.handle"
import { Dirent } from 'fs';

async function loadBook(h: Dirent) {
    loadBookFromFile(
        new Blob([await window.vuk.open(library.value + "/" + h.name)]) as File,
    )
}

watch(() => library.levels.length, s => {
    library.value = library.root + (s ? "/" + library.levels.join("/") : "")
})
watch(() => library.value, async (dir) => {
    if (dir === undefined)
        return;

    const items = await window.vuk.list(dir)
    sorter.books = items.books;
    sorter.dirs = items.dirs;
})
watch(() => library.root, async (rootName) => {
    if (rootName !== undefined) {
        console.log(rootName);

        db.settings.put({
            id: settings_id,
            electronDir: rootName,
            speechRate: 0,
        })
    }
})
async function setLibrary() {
    const libraryRoot = await window.
        vuk.dir();
    libraryRoot && library.setRoot(libraryRoot)
}
onBeforeMount(async () => {
    if (!library.root) {
        const settings = await db.settings.get(settings_id);
        if (settings && settings.electronDir) {
            library.setRoot(settings.electronDir)
        }
    }
})
</script>