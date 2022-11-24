<template>
    <BaseActions>
        <q-btn v-if="$q.platform.is.desktop" @click="setLibrary" title="Set library" class="btn" icon-right="folder">
            Set&nbsp;
        </q-btn>
        <q-btn @click="restoreLibrary" title="Restore library" class="btn" icon="restore" icon-right="folder"
            v-if="$q.platform.is.desktop" />
    </BaseActions>
    <VListing 
        :library="Dir" 
        :sorter="Sorter" 
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
import { Dir, getLastWorkingDir, settings_id, Sorter, Status } from "./Handle"
import { aDirHandle } from "./util"
import BaseActions from "./BaseActions.vue"
import VListing from "./Listing.vue"

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

async function restoreLibrary() {
    const res = await getLastWorkingDir()
    if (res.handle) {
        Dir.setRoot(res.handle)
        Dir.setDir(Dir.root)
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
    restoreLibrary,
    { target: document }
)

onMounted(() => {
    restoreLibrary()
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