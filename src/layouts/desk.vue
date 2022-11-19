<template>
  <q-tabs :vertical="onDesk" align="left" switch-indicator shrink content-class="sidebar" v-model="tab" on-same-tab="deselect" active-color="black" 
  class="bg-secondary text-grey-7 shadow-2"
  >
    <q-tab name="browse" icon="folder" title="Browse" @click="toggleSelect('browse')" />
    <q-tab name="toc" icon="list" title="Table of contents" @click="toggleSelect('toc')" />
    <q-tab name="bookmarks" icon="bookmarks" title="Bookmarks" @click="toggleSelect('bookmarks')" />
    <q-tab name="config" icon="settings" title="Config" @click="toggleSelect('config')" />
  </q-tabs>
  <main>
  <Transition name="slide" >
    <q-tab-panels v-model="tab" v-if="tab?.length" class="shadow-3">
      <q-tab-panel name="browse">
        <Explorer />
      </q-tab-panel>
      <q-tab-panel name="toc">
        <TOCVue />
      </q-tab-panel>
      <q-tab-panel name="bookmarks">
        <Bookmarks />
      </q-tab-panel>
      <q-tab-panel name="config">
        <SettingsPage />
      </q-tab-panel>
    </q-tab-panels>
  </Transition>
    <Live />
</main>
</template>
  
<script setup lang=ts>
import Live from 'src/Book/Live.vue';
import Bookmarks from 'src/Bookmarks/Bookmarks.vue';
import Explorer from 'src/Library/Explorer.vue';
import { ref, watch } from 'vue'
import TOCVue from 'src/TOC/TOC.vue';
import { QTabs } from 'quasar';
import SettingsPage from 'src/settings/SettingsPage.vue';
import { useEventListener, useMediaQuery } from '@vueuse/core';
const tab = ref<string | undefined>("")

const isSelected = ref(false);

/* if device has no touch screen */
const onDesk = useMediaQuery("(any-pointer: fine) and (min-width: 1024px)");

function toggleSelect(tabName: string) {
  console.log({ tabName });
  if (tabName === tab.value) {
    isSelected.value = true
  } else {
    tab.value = tabName
  }
}

watch(tab, it => {
  if (typeof it === "string") {
    isSelected.value = false
  }
})

watch(isSelected, n => {
  if (n === true) {
    tab.value = undefined
    isSelected.value = false
  }
})

const hotkeys = {
  f:"browse",
  b:"bookmarks",
  t:"toc"
}
useEventListener("keyup", e => {
  console.log(e.key);
  
  switch(e.key)  {
    case "Escape":
      tab.value = undefined
    break;
    default:
      if (hotkeys[e.key as keyof typeof hotkeys]) {
        toggleSelect(hotkeys[e.key as keyof typeof hotkeys])
      }
  }
})
</script>
<style lang="sass">
@use "../sass/scrollbar"
#q-app
  display: grid
  height: 100dvh
  height: 100vh
  @include mobile
    grid-template-areas: "book""nav"
    grid-template-rows: 1fr auto

  @include desk
    grid-template-areas: "nav book"
    grid-template-columns: auto 1fr
</style>
<style lang=sass scoped>
.q-page-container
  width: 100%

  /* TODO: Class for d/vh usage */

main
  grid-area: book
.q-tabs
  position: sticky

  grid-area: nav

  @include mobile
    bottom: 0

  @include desk
    top: 0
    height: 100dvh
    height: 100vh /* Fallback */

.q-tab-panels
  z-index: 1
  position: fixed
  height: 100dvh
  height: 100vh /* Fallback */
  resize: horizontal
  width: 100%
  
  @include desk
    width: 30vw

.q-tab-panel
  padding: 1vw 1vh
.q-tabs
  z-index: 2

.slide-enter-active,
.slide-leave-active
  transition: all 50ms

.slide-enter-from,
.slide-leave-to 
  opacity: 0

  @include mobile
    transform: translateY(30vh)
  @include desk
    transform: translateX(-30vw)

</style>