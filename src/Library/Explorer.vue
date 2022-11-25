<template>
    <BaseActions>
        <LibraryBtn  v-if="$q.platform.is.desktop" @click="setLibrary" />
        <RestoreBtn v-if="$q.platform.is.desktop" @click="restoreLibrary" />
    </BaseActions>
    <VListing 
        :library="library" 
        :sorter="sorter" 
        @open-book="loadBookFromHandle"
    >
    </VListing>
</template>
<script setup lang=ts>
import { onMounted } from "vue"
import { onKeyUp } from "@vueuse/core"
import { directoryOpen } from "browser-fs-access"
import { loadBookFromHandle } from "./fileReader"
import { db } from "../db/dexie"
import { library, getLastWorkingDir, settings_id, sorter, Status } from "./Handle"
import { aDirHandle } from "./util"
import BaseActions from "./BaseActions.vue"
import VListing from "./Listing.vue"
import LibraryBtn from "./LibraryBtn.vue"
import RestoreBtn from "./RestoreBtn.vue"

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
    restoreLibrary()
}

async function restoreLibIfUnset() {
    if (library.root)
        return;

    return restoreLibrary()
}
async function restoreLibrary() {
    const res = await getLastWorkingDir()
    if (res.handle) {
        library.setRoot(res.handle)
        library.setDir(library.root)
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