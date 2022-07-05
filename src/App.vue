<script setup>
import {onMounted, ref} from "vue"
import { useTitle } from "@vueuse/core"
//Components
import SidePanel from "./components/SidePanel.vue"
import VLive from "./Live/Live.vue"
import {loadBookFromLauncher} from "./Library/fileReader"
import WelcomePage from "./components/WelcomePage.vue"
import TOC from "./TOC/TOC";
import VFooter from "./components/Footer.vue"

useTitle("Vuk | An EPUB reader for the web.")

onMounted(() => {
  loadBookFromLauncher();
})
</script>
<template>
 <SidePanel />
  <main>
    <!-- vHeader here -->
    <VLive />
    <VFooter />
  </main>
</template>

<!-- Note the FF styles will be applied for the entire APP -->
<style lang="sass">
@use "./sass/colors"
@use "./sass/scrollbar"

@import "./sass/media_queries"
@import "./sass/mixins"

body
  margin: 0
  padding: 0
  height: 100vh
  overflow: hidden

#app
  @include lex
  height: inherit

  @include desk(min-width)
    flex-direction: row

main
  @include lex
  flex: 1
  align-items: center

  font-size: 2rem
  overflow-y: auto
  overflow-x: hidden

  @media screen and (hover: none) and (max-width: $lim) 
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