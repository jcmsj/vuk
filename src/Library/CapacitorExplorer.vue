<template>
    <BaseActions>
        <LibraryBtn @click="setLibrary" />
        <!-- <RestoreBtn @click="restoreLibrary" /> -->
    </BaseActions>
    <div v-for="file in files">
        {{ file.name }}
        <br />
        {{ file.type }}
    </div>
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
import RestoreBtn from "./RestoreBtn.vue"
import BaseActions from "./BaseActions.vue"

import { Directory, Filesystem as FS, FileInfo } from '@capacitor/filesystem';
import { shallowRef } from 'vue';

const files = shallowRef<FileInfo[]>([]);
async function setLibrary() {
    const p = await FS.requestPermissions();
    files.value = (await FS.readdir({path: '/', directory: Directory.Documents})).files;
    console.log(files.value);
    
}
</script>
