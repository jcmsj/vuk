  /* eslint-disable no-unused-vars */
<script setup>
import {onMounted, ref} from "vue"
import { useTitle } from "@vueuse/core"
//Components
import SidePanel from "./components/panels/SidePanel.vue"
import PageRenderer from "./components/PageRenderer.vue"
import {loadBookFromLauncher} from "./modules/loadBookFromFile"
useTitle("Vuk | An EPUB reader for the web.")

onMounted(() => {
  loadBookFromLauncher();
})
</script>
<template>
  <SidePanel 
  ></SidePanel>
  <PageRenderer>
  </PageRenderer>
</template>

<!-- Note the FF styles will be applied for the entire APP -->
<style lang="sass">
:root 
  --color-1-t: #c0a7e8
  --color-1: #8250D2
  --color-2-t: #f8e7c9
  --color-2: wheat
  --color-2-d: #dcc7a1
  --color-2-d2: #c4b18f
  --color-3: white

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

button.btn
  background: var(--color-2-d)
  border: none
  border-radius: 5px
  font-size: 1.3rem
  &:hover
    background: var(--color-2-d2)

%padV1
  padding: 1vh 1vw

/* width */
::-webkit-scrollbar
  width: 10px

/* Track */
::-webkit-scrollbar-track
  background-color: var(--color-2)

/* Handle */
::-webkit-scrollbar-thumb
  background-color: var(--color-1)

</style>