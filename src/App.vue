/* eslint-disable no-unused-vars */
<script setup>
import {ref} from "vue"
import AppHeader from "./components/AppHeader.vue"
import AppFooter from "./components/AppFooter.vue"
import FileSelector from "./components/FileSelector.vue"
import AppTOC from "./components/TOC.vue"

import Epub from "./Epub.js"
const book = ref(null),
  text = ref(null),
  TOC = ref(false),
  ssrc = ref("");
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
        showContent(TOC.value[0].id)
    })

    epub.on("parsed-metadata", async() => {

    })

    epub.parse()

    book.value = epub;
}

async function showContent(id) {
  console.log("Loading: ", id);

  text.value.innerHTML = await book.value.getChapter(id)
}

</script>
<template>
  <aside>
    <AppTOC v-if="TOC" :TOC="TOC" v-on:show="showContent"></AppTOC>
    <div v-else>The book's TOC will be displayed here.</div>
  </aside>
  <main>
    <AppHeader>
      <FileSelector @update="loadBook">
      </FileSelector>
    </AppHeader>
    <div class="text" ref="text">Click + to load a book</div>
    <img :src="ssrc" alt="" srcset="">
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
  grid-template-columns: 3fr 7fr
  height: inherit
</style>

<style lang="sass" scoped>
%padV1
  padding: 1vh 1vw

main
  display: flex
  flex-direction: column
  align-items: center
  overflow: scroll
  & > img
    max-width: 80vw

aside
  @extend %padV1

.text
  @extend %padV1
</style>
