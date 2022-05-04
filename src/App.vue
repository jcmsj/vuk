/* eslint-disable no-unused-vars */
<script setup>
import {ref, onMounted} from "vue"
import AppHeader from "./components/AppHeader.vue"
import AppFooter from "./components/AppFooter.vue"
import FileSelector from "./components/FileSelector.vue"
import AppTOC from "./components/TOC.vue"
import Commands from "./Commands.js"
import Epub from "./Epub.js"
const book = ref(null),
  text = ref(null),
  aside = ref(null),
  TOC = ref(false),
  showAside = ref(false)

/**
 * @param {File} file
 */
async function loadBook(file) {
    const epub = new Epub(file)

    epub.on("parsed-root", async() => {
        epub.parseRootFile(epub.rootXML)
    })

    epub.on("parsed-guide", async() => {
    })

    epub.on("parsed-manifest", async() => {
    })

    epub.on("parsed-spine", async() => {
      console.log(epub.manifest);
    })

    epub.on("parsed-toc", async() => {
        //Todo: Draw to sidebar
        console.log("T", epub.toc);
        TOC.value = epub.toc
    })

    epub.on("loaded", async() => {
        /* text.value.innerHTML = await epub.getChapter("chapter1.xhtml")
        const n = "FrontMatter1.jpg"
        epub.getImage(n, (reader) => {
            ssrc.value = reader.result
        }) */
        showContent(epub.flow[epub.flowIndex].id)
    })

    epub.on("parsed-metadata", async() => {

    })

    epub.parse()

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
  const {str, isCached} = await book.value.getContent(id)

  removeAllChildNodes(text.value)
  
  if (isCached) {
    console.log(str);
    text.value.innerHTML = str
  } else {
      const d = document.createElement("div")
      d.innerHTML = str;
      text.value.appendChild(d.firstElementChild)
  }

  //Todo: Figure out how to cache the base64 encoded img
  loadImages()
}

async function loadImages() {
  const elems = text.value.querySelectorAll(".book-img");

  for( const elem of elems) {
    if(!elem.dataset.src) {
      continue
    }

    const id = elem.dataset.src;

    await book.value.getImage(id, r => {
      elem.src = r
    })
  }

}

onMounted(() => {
  const cmd = new Commands({
    "c": () => {
      toggleAside()
    }
  })
})
</script>
<template>
  <aside :ref="aside" :active="showAside">
    <FileSelector @update="loadBook">
    </FileSelector>
    <AppTOC v-if="TOC" :TOC="TOC" v-on:show="showContent"></AppTOC>
    <div v-else>The book's TOC will be displayed here.</div>
  </aside>
  <main>
    <AppHeader>

    </AppHeader>
    <div class="text" ref="text">Click + to load a book</div>
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
  & > img
    max-width: 80vw

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
    max-width: 50vw
    margin: 1vh 1vw
</style>