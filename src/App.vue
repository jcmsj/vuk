  /* eslint-disable no-unused-vars */
<script setup>
import {ref} from "vue"
import { useTitle } from "@vueuse/core"
//Components
import SidePanel from "./components/SidePanel.vue"
import PageRenderer from "./components/PageRenderer.vue"

useTitle("Vuk | An EPUB reader for the web.")

</script>
<template>
  <SidePanel 
  ></SidePanel>
  <PageRenderer>
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