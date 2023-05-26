<template>
    <BaseActions>
        <LibraryBtn  v-if="$q.platform.is.desktop && !$q.platform.is.firefox" @click="setLibrary" />
        <RestoreBtn v-if="$q.platform.is.desktop && !$q.platform.is.firefox" @click="restoreLibrary" />
    </BaseActions>
    <VListing 
        v-if="library"
        :library="library" 
        :sorter="librarian" 
        @open-book="loadBook"
    >
    </VListing>
</template>
<script setup lang=ts>
import { onMounted, ref } from "vue"
import { onKeyUp } from "@vueuse/core"
import { directoryOpen } from "browser-fs-access"
import { loadBook } from "./fileReader"
import { db } from "../db/dexie"
import { settings_id } from 'src/settings/settings_id';
import { aDirHandle } from "./util"
import BaseActions from "./BaseActions.vue"
import VListing from "./Listing.vue"
import LibraryBtn from "./LibraryBtn.vue"
import RestoreBtn from "./RestoreBtn.vue"
import { FileSystemDirectoryHandleToDir, createWeb, getLastWorkingDir, librarian } from "src/fs/web"
import { FS, Status } from "src/fs"

async function setLibrary() {
    let handle;
    try {
        [{ directoryHandle: handle }] = await directoryOpen();

        if (!aDirHandle(handle))
            throw "Not a directory."

    } catch (e) {
        console.log(e);
        return
    }
    await db.settings.put({
        id: settings_id,
        lastDir: handle,
        speechRate: 0 //TODO migrate settings to dexie
    })
    restoreLibrary();
}
const library = ref<FS>();
async function restoreLibIfUnset() {
    if (library.value)
        return;

    return restoreLibrary()
}
async function restoreLibrary() {
    const res = await getLastWorkingDir()
    if (res.handle) {
        const dir = await FileSystemDirectoryHandleToDir(res.handle);
        library.value = await createWeb(dir!);
        return;
    }

    switch (res.status) {
        case Status.denied:
            alert("Please allow the e-reader to READ the contents of the directory.")
            console.log("Failed to get directory permission");
            break;
        case Status.unset:
            //Maybe new user
            //TODO: Show Get started
            break;
    }
}

onKeyUp(
    "f",
    restoreLibIfUnset,
    { target: document }
)

onMounted(() => {
    restoreLibIfUnset()
})


</script>
<style lang='sass' scoped>
@use "src/sass/v-item"
.q-btn-group
    margin-bottom: 1vh
    display: flex
button
    margin: 1vh 1vw
    display: inline

</style>