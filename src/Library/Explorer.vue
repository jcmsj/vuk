<template>
    <q-btn-group spread>
        <q-btn color="primary" @click="chooser?.click()" title="Open an EPUB" icon-right="book">
            Open
        </q-btn>
        <q-btn v-if="$q.platform.is.desktop" @click="setLibrary" title="Set library" class="btn" icon-right="folder">
            Set&nbsp;
        </q-btn>
        <q-btn @click="restoreLibrary" title="Restore library" class="btn" icon="restore" icon-right="folder"
            v-if="$q.platform.is.desktop" />
    </q-btn-group>
    <input type=file hidden ref=chooser @change=selectFile :accept="Epub.MIME">
    <q-list>
        <q-item clickable v-if="Dir.root && !Dir.inRoot" @click="Dir.goto(Dir.root)">
            <q-item-section avatar>
                <q-icon color="primary" name="folder" />
            </q-item-section>
            <q-item-section>
                /
            </q-item-section>
        </q-item>
        <q-item v-if="Dir.levels.length" clickable @click="Dir.moveUp()">
            <q-item-section avatar>
                <q-icon color="primary" name="folder" />
            </q-item-section>
            <q-item-section>
                ../
            </q-item-section>
        </q-item>
    </q-list>
    <q-item v-for="(handle, dirname) of Sorter.dirs" clickable :key="dirname" @click="Dir.goto(handle)">
        <q-item-section avatar>
            <q-icon color="primary" name="folder" />
        </q-item-section>
        <q-item-section>
            {{ dirname }}
        </q-item-section>
    </q-item>
    <q-item v-for="(handle, name) of Sorter.books" clickable :key="name" @click="loadBookFromHandle(handle)">
        <q-item-section avatar>
            <q-icon color="primary" name="book" />
        </q-item-section>
        <q-item-section>
            {{ name }}
        </q-item-section>
    </q-item>
</template>
<script setup lang=ts>
import { onMounted, ref } from "vue"
import { onKeyUp } from "@vueuse/core"
import { directoryOpen } from "browser-fs-access"
import { loadBookFromFile, loadBookFromHandle } from "./fileReader"
import { db } from "../db/dexie"
import { Dir, getLastWorkingDir, settings_id, Sorter, Status } from "./Handle"
import { QBtnGroup, QBtn, QList, QItem, QItemSection, QIcon } from "quasar"
import { aDirHandle } from "./util"
import { Epub } from "@jcsj/epub"

const chooser = ref<HTMLInputElement>();

async function selectFile(e: any) {
    loadBookFromFile(chooser.value!.files![settings_id])
}

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