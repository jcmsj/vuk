/* eslint-disable no-unused-vars */
<script setup>
import {ref, onMounted} from "vue"
import AppHeader from "./components/AppHeader.vue"
import AppFooter from "./components/AppFooter.vue"
import FileSelector from "./components/FileSelector.vue"
import AppTOC from "./components/TOC.vue"
import Commands from "./Commands.js"
import Epub from "./Epub.js"
import Test from "./components/Test.js"

import BookLibrary from "./components/BookLibrary.vue"
const book = ref(null),
    text = ref(null),
    aside = ref(null),
    TOC = ref(false),
    showAside = ref(false),
    titles = ref([]),
    dir = ref(""),
    dirData = ref([])

let shownContent = null;
async function loadLibrary() {
  db.getDirHandle(dir.value, res => {
    dirData.value = res
  })
}
/**
 * @param {FileSystemFileHandle} handle
 */
async function loadBookFromHandle(handle) {
  const file = await handle.getFile()
  loadBook(file)
}

/**
 * @param {File} file
 */
async function loadBook(file, cached = false) {
    const epub = new Epub(file)
    epub.open()

    epub.on("parsed-root", async() => {
        epub.parseRootFile(epub.rootXML)
    })

    epub.on("parsed-manifest", async() => {
      Test.isset(epub.manifest)
      console.log("Manifest: ", epub.manifest);
    })

    epub.on("parsed-spine", async() => {
      Test.isset(epub.flow)
      console.log("Flow: ", epub.flow);
    })

    epub.on("parsed-toc", async() => {
        //Todo: Draw to sidebar
        Test.isset(epub.toc)
        console.log("TOC: ", epub.toc);
        TOC.value = epub.toc
    })

    epub.on("loaded", async() => {
      document.title = epub.metadata.title
        showContent(epub.flow[epub.flowIndex].id)

        if(!cached) {
           //Todo: In memory caching
        }
    })

    epub.on("parsed-metadata", async() => {

    })

    book.value = epub;
}

function toggleAside() {
  showAside.value = !showAside.value
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

async function showContent(id) {
  if (shownContent == id) {
    return
  }

  shownContent = id;

  const str = await book.value.getContent(id)

  removeAllChildNodes(text.value)
  text.value.innerHTML = str
  //Todo: Figure out how to cache the base64 encoded img
  loadImages()
}

async function loadImages() {
  const elems = text.value.querySelectorAll("img");

  for( const elem of elems) {
    if(!elem.dataset.src) {
      continue
    }

    const id = elem.dataset.src;

    elem.src = await book.value.getImage(id)
  }

}

onMounted(() => {
  const cmd = new Commands({
    "c": () => {
      toggleAside()
    }
  })
    /* DB.getBooks(5, r => {
        console.log(r);        
    }) */
})
</script>
<template>
  <aside :ref="aside" :active="showAside">
    <BookLibrary
      @load-book="loadBookFromHandle"
    ></BookLibrary >
    <FileSelector @update="loadBook">
    </FileSelector>
    <AppTOC v-if="TOC" :TOC="TOC" v-on:show="showContent"></AppTOC>
    <div v-else>The book's TOC will be displayed here.</div>
  </aside>
  <main>
    <AppHeader>

    </AppHeader>
    <div class="text" ref="text" @click="addTest">
      Click + to load a book
    </div>
    <AppFooter></AppFooter>
  </main>
</template>

<style lang="sass">
body
  margin: 0
  padding: 0
  height: 100vh
  overflow: hidden

#app
  display: grid
  height: inherit
  grid-template-columns: 1fr

%padV1
  padding: 1vh 1vw

main
  display: flex
  flex-direction: column
  align-items: center
  overflow-y: scroll
  overflow-x: hidden

aside
  @extend %padV1
  position: absolute
  background-color: wheat
  height: 100%
  max-width: 30vw
  &[active="true"]
    display: none

.text
  @extend %padV1
  display: flex
  flex-direction: column
  align-items: center
  font-size: larger
  img
    object-fit: contain
    max-width: 80vw
    max-height: 90vh
    margin: 1vh 1vw
</style>