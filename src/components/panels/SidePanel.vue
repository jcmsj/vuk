<template>
  <aside>
    <nav
    >
      <!-- <button class="mobile-nav">
      &#9776;
      </button> -->
      <button
        @click="changeTab(0)"
        title="File explorer"
        class="btn"
      >
      📂
      </button>
      <button
        @click="changeTab(1)"
        title="Table of contents"
        class="btn"
      >
      📋
      </button>
      <button
        @click="changeTab(2)"
        title="Bookmarks"
        class="btn"
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
import { ref } from "vue"
import {onKeyUp} from "@vueuse/core"
import vTOC from "./TOC.vue"
import vLibrary from "./Library.vue";
import vBookmarks from "./Bookmarks.vue"
const tabIndex = ref(0);
const isDisplayed = ref(false);
function toggleAside() {
  isDisplayed.value = !isDisplayed.value
}

function hideAside() {
    isDisplayed.value = false
}

function showAside() {
    isDisplayed.value = true

    document
      .querySelector("main")
      .addEventListener("scroll", hideAside, {once:true});
}


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
<style lang="sass">
.default-text
  text-align: center

b.tab-label
  text-align: center
</style>
<style lang='sass' scoped>
@import "src/sass/media_queries"
aside
  display: flex
  background-color: wheat
  
  @include mobile
    flex-direction: column

section
  padding: 5px
  overflow-y: auto
  flex-direction: column
  display: none
  transition: transform 100ms

  @include mobile
    transform: translateY(-30vh)
    transition: max-height 70ms
    max-height: 0
    padding: 1vh 1vw

    @include active
      max-height: 30vh
      transform: translateY(0)
      display: flex

  @include mobile(min-width)
    transform: translateX(-25vw)
    transition: max-width 70ms
    display: flex
    max-width: 0
    resize: horizontal

    @include active
      max-width: 25vw
      transform: translateX(0)
      display: flex

.panel
  display: none

  @include active
      display: block
nav
  display: flex
  row-gap: 1vh
  column-gap: 1vw
  padding: 3px

  @include desk(min-width)
    flex-direction: column
.mobile-nav
  display: block
  
  @include desk(min-width)
    display: none

</style>