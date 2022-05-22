  /* eslint-disable no-unused-vars */
<script setup>
import {ref} from "vue"
import { useTitle } from "@vueuse/core"
//Components
import AppHeader from "./components/AppHeader.vue"
import AppFooter from "./components/AppFooter.vue"
import SidePanel from "./components/SidePanel.vue"
import PageRenderer from "./components/PageRenderer.vue"

useTitle("Vuk | An EPUB reader for the web.")
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
  <PageRenderer>
    <template v-slot:header>
    <AppHeader 
      @toggle-s-panel="toggleAside"
      name="header"
    >
    </AppHeader>
    </template>

    <template v-slot:footer>
      <AppFooter></AppFooter>
    </template>
  </PageRenderer>
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

</style>