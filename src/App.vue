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
  TOC = ref({}),
  ssrc = ref("");
/**
 * @param {File} file
 */
// eslint-disable-next-line no-unused-vars
async function loadBook(file) {
    const epub = new Epub(file)

    epub.on("parsed-root", () => {
        epub.parseRootFile(epub.rootXML)
    })

    epub.on("parsed-metadata", () => {
        //Todo: Show cool book loading complete
    })

    epub.on("parsed-guide", () => {

    })

    epub.on("parsed-manifest", () => {

    })

    epub.on("parsed-spine", () => {

    })

    epub.on("parsed-toc", () => {
        //Todo: Draw to sidebar
        TOC.value = epub.toc
    })

    epub.on("loaded", async() => {
        text.value.innerHTML = await epub.getChapter("chapter1.xhtml")
        const n = "FrontMatter1.jpg"
        epub.getImage(n, (reader) => {
            ssrc.value = reader.result
        })
    })

    epub.parse()
    book.value = epub;
}
</script>
<template>
<div>
  <aside>
    <AppTOC :TOC="TOC"></AppTOC>
  </aside>
  <AppHeader>
      <FileSelector @update="loadBook">
      </FileSelector>
  </AppHeader>
  <main>
    <div ref="text"></div>
    <img :src="ssrc" alt="" srcset="">
  </main>
  <AppFooter></AppFooter>
</div>

</template>

<style>

</style>