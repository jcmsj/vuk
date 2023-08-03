<template>
    <BaseActions>
        <LibraryBtn @click="setLibrary" />
    </BaseActions>
    <div v-for="file in files" @click="tap(file)">
        {{ file.name }} | {{ file.type }}
    </div>
    {{ files.filter(f => f.type == "file") }}
    {{ a }}
    <!-- <VListing 
        v-if="library"
        :fs="library" 
        :sorter="librarian" 
        @open-book="loadBook"
    >
    </VListing> -->
</template>
<script setup lang="ts">
import LibraryBtn from "./LibraryBtn.vue"
import BaseActions from "./BaseActions.vue"
import { Directory, Filesystem as FS, FileInfo } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { ref, shallowRef } from 'vue';
import { loadBookFromFile } from "./fileReader";

const files = shallowRef<FileInfo[]>([]);
const a = ref<any>()
async function setLibrary() {
    await FS.checkPermissions()
    await FS.requestPermissions();
    const folder = await FS.readdir({path: '/', directory: Directory.ExternalStorage});
    files.value = folder.files
    console.log(files.value);
    
}
async function tap(info:FileInfo) {
    a.value = info
    if (info.type == "file") {
        const src = Capacitor.convertFileSrc(info.uri)
        const r = await fetch(src)
        const file = new File([await r.blob()], info.name, {
            type: info.type,
            lastModified: info.mtime
        })
        await loadBookFromFile(file)
    } else {
        files.value = (await FS.readdir({path: info.name, directory: Directory.ExternalStorage})).files
    }
}
</script>
