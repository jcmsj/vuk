<template>
  <aside
  >
    <nav>
      <button
        @click="changeTab(0)"
      >
      📂
      </button>
      <button
        @click="changeTab(1)"
      >
      📋
      </button>
      <button
        @click="changeTab(2)"
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

section
  padding: 5px
  overflow-y: auto
  resize: horizontal
  flex-direction: column
  max-width: 0
  transform: translateX(-30vw)
  display: flex
  transition: transform 100ms
  transition: max-width 70ms

  &[active="true"]
    max-width: 30vw
    transform: translateX(0)

.panel
  display: none

  &[active="true"]
      display: block
nav
  display: flex
  flex-direction: column
  row-gap: 1vh
  padding: 3px
</style>