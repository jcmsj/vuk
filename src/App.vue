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
    epub.on("parsed-metadata", async() => {
      //Todo: Cache it, Show cool book loading complete
      console.log("Metadata: ", epub.metadata);
    })
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