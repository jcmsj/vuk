<script setup>
import {onMounted, ref} from "vue"
import { useTitle } from "@vueuse/core"
//Components
import SidePanel from "./components/panels/SidePanel.vue"
import PageRenderer from "./components/PageRenderer.vue"
import {loadBookFromLauncher} from "./modules/fileReader"
import WelcomePage from "./components/WelcomePage.vue"
import {Flow} from "./modules/reactives";

useTitle("Vuk | An EPUB reader for the web.")

onMounted(() => {
  loadBookFromLauncher();
})
</script>
<template>
  <SidePanel 
  ></SidePanel>
  <PageRenderer
    v-if="Flow.items.size"
  ></PageRenderer>
  <WelcomePage v-else/>
</template>

<!-- Note the FF styles will be applied for the entire APP -->
<style lang="sass">
@use "./sass/colors"
@use "./sass/scrollbar"

body
  margin: 0
  padding: 0
  height: 100vh
  overflow: hidden

#app
  display: flex
  height: inherit
  flex-direction: column
  @media screen and (hover: hover) and (min-width: 1024px)
    flex-direction: row

main
  display: flex
  flex-direction: column
  flex: 1
  align-items: center

  font-size: 2rem
  overflow-y: auto
  overflow-x: hidden

  @media screen and (hover: none) and (max-width: 1280px) 
      font-size: smaller

button.btn
  background: var(--color-2-d)
  border: none
  border-radius: 5px
  font-size: 1.3rem
  &:hover
    background: var(--color-2-d2)

%padV1
  padding: 1vh 1vw

</style>