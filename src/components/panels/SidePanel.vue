<template>
  <aside
  >
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

section
  padding: 1vh 1vw
  background-color: wheat
  max-width: 30vw
  overflow-y: auto
  display: none
  resize: horizontal
  flex-direction: column
  &[active="true"]
      display: flex

.panel
  display: none

  &[active="true"]
      display: block
nav
  display: flex
  flex-direction: column
  row-gap: 1vh
</style>