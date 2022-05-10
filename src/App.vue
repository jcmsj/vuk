  /* eslint-disable no-unused-vars */
<script setup>
import {ref} from "vue"

//Components
import AppHeader from "./components/AppHeader.vue"
import AppFooter from "./components/AppFooter.vue"
import AppTOC from "./components/TOC.vue"
import BookLibrary from "./components/BookLibrary.vue"
import SidePanel from "./components/SidePanel.vue"
import PageRenderer from "./components/PageRenderer.vue"

const sPanelIsActive = ref(false)

function toggleAside() {
  sPanelIsActive.value = !sPanelIsActive.value
}

function hideAside() {
    sPanelIsActive.value = false
}

function showAside() {
    sPanelIsActive.value = true
}
</script>
<template>
  <SidePanel 
    :active="sPanelIsActive" 
    @toggle-s-panel="toggleAside"
    @show-s-panel="showAside"
    @hide-s-panel="hideAside"
    ></SidePanel>
  <main>
    <AppHeader @toggle-s-panel="toggleAside">

    </AppHeader>
    <PageRenderer></PageRenderer>
    <AppFooter></AppFooter>
  </main>
</template>

<!-- Note the FF styles will be applied for the entire APP -->
<style lang="sass">
body
  margin: 0
  padding: 0
  height: 100vh
  overflow: hidden

#app
  display: flex
  height: inherit

%padV1
  padding: 1vh 1vw

main
  display: flex
  flex-direction: column
  flex: 1
  align-items: center
  overflow-y: auto
  overflow-x: hidden
  padding: 1vh 1vw

</style>