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
import { asDir} from 'src/fs/electron';
import { librarian } from 'src/fs/prepLibrarian';
watch(() => library.value?.root, rootDir => {
    if (rootDir === undefined) 
        return;

    console.log(rootDir);
    db.settings.put({
        id: settings_id,
        electronDir: rootDir.name,
        speechRate: 0,
    })
    librarian.sort(rootDir);
}) 
async function setLibrary() {
    const libraryRootPath = await window.
        vuk.dir();
    if (libraryRootPath) {
        library.value = await createFS(asDir(libraryRootPath));
    }
}
onBeforeMount(async () => {
    if (library.value == undefined) {
        const settings = await db.settings.get(settings_id);
        if (settings && settings.electronDir) {
            library.value = await createFS(asDir(settings.electronDir));
        }
    }
})
</script>