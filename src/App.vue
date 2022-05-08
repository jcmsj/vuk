  /* eslint-disable no-unused-vars */
<script setup>
import {ref, provide} from "vue"
import {onKeyUp, useTitle} from "@vueuse/core"

//Modules
import Epub from "./modules/Epub.js"
import Test from "./modules/Tester.js"

//Components
import AppHeader from "./components/AppHeader.vue"
import AppFooter from "./components/AppFooter.vue"
import FileSelector from "./components/FileSelector.vue"
import AppTOC from "./components/TOC.vue"
import BookLibrary from "./components/BookLibrary.vue"

const 
    title = useTitle(),
    book = ref(null),
    text = ref(null),
    TOC = ref([]),
    titles = ref([]),
    tabIndex = ref(0),
    asideIsShown = ref(false)

provide("TOC", TOC)

let shownContent = null;

/**
 * @param {File} file
 */
async function loadBookFromFile(file, cached = false) {
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
        title.value = epub.metadata.title
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
  asideIsShown.value = !asideIsShown.value
}

function hideAside() {
    asideIsShown.value = false
}

function showAside() {
    asideIsShown.value = true
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

  for(const elem of elems) {
    if(!elem.dataset.src) {
      continue
    }

    const id = elem.dataset.src;

    elem.src = await book.value.getImage(id)
  }

}

onKeyUp("f", e => {
  changeTab(0)
}, {target:document})

onKeyUp("c", e => {
  changeTab(1)
}, {target:document})

onKeyUp("Escape", e => {
    hideAside()
}, {target:document})

function changeTab(i) {
    tabIndex.value = i;
    showAside()
}
</script>
<template>
  <aside :active="asideIsShown">
    <BookLibrary
      @load-book="loadBookFromFile"
      :active="tabIndex == 0"
    ></BookLibrary>
    <AppTOC 
      :TOC="TOC" 
      :active="tabIndex == 1"
      v-on:show="showContent">
    </AppTOC>
  </aside>
  <main>
    <AppHeader>

    </AppHeader>
    <div class="text" ref="text" @click="addTest">
        Press: <br>
        
        C - Show TOC <br>
        F - Show File explorer
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
    overflow-y: auto
    display: none

    &[active="true"]
        display: flex
    & > *
        display: none
    & > *[active="true"]
        display: block

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