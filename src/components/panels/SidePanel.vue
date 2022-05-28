<template>
  <aside
  >
    <nav>
      <!-- <button class="mobile-nav">
      &#9776;
      </button> -->
      <button
        @click="changeTab(0)"
        title="File explorer"
      >
      📂
      </button>
      <button
        @click="changeTab(1)"
        title="Table of contents"
      >
      📋
      </button>
      <button
        @click="changeTab(2)"
        title="Bookmarks"
      >
      &#x1F516;
      </button>
    </nav>
    <section
    :active="isDisplayed"
    >
      <vLibrary
        :active="tabIndex == 0"
        class="panel"
      ></vLibrary>
      <vTOC
        :active="tabIndex == 1"
        class="panel"
        >
      </vTOC>
      <vBookmarks
        :active="tabIndex == 2"
        class="panel"
      ></vBookmarks>
    </section>
  </aside>
</template>
<script setup>
import {ref} from "vue"
import {onKeyUp} from "@vueuse/core"
import vTOC from "./TOC.vue"
import vLibrary from "./Library.vue";
import vBookmarks from "./Bookmarks.vue"

const isDisplayed = ref(false);
function toggleAside() {
  isDisplayed.value = !isDisplayed.value
}

function hideAside() {
    isDisplayed.value = false
}

function showAside() {
    isDisplayed.value = true
}

const tabIndex = ref(0);

["f", "c", "b"].map((key, i) => {
  onKeyUp(key, e => {
    changeTab(i)
  }, {target:document})
})

onKeyUp("Escape", e => {
      hideAside()
}, {target:document})

function changeTab(i) {
    if (i == tabIndex.value) {
        toggleAside()
        return
    } 
    
    tabIndex.value = i;
    showAside()
}

</script>
<style lang='sass' scoped>
aside
  display: flex
  background-color: wheat

  @media screen and (hover: none) and (max-width: 1024px)
    flex-direction: column


section
  padding: 5px
  overflow-y: auto
  resize: horizontal
  flex-direction: column
  display: none
  transition: transform 100ms

  @media screen and (hover: none) and (max-width: 1024px)
    transform: translateY(-30vh)
    transition: max-height 70ms
    max-height: 0

    &[active="true"]
      max-height: 30vh
      transform: translateY(0)
      display: flex

  @media screen and (hover: hover) and (min-width: 1024px)
    transform: translateX(-30vw)
    transition: max-width 70ms
    display: flex
    max-width: 0

    &[active="true"]
      max-width: 30vw
      transform: translateX(0)
      display: flex

.panel
  display: none

  &[active="true"]
      display: block
nav
  display: flex
  row-gap: 1vh
  padding: 3px

  @media screen and (hover: hover) and (min-width: 1024px)
    flex-direction: column

.mobile-nav
  display: block

  @media screen and (hover: hover) and (min-width: 1024px)
    display: none
</style>