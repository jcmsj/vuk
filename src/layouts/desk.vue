<template>
  <q-tabs vertical align="left" switch-indicator shrink content-class="sidebar" v-model="tab" on-same-tab="deselect">
    <q-tab name="browse" icon="folder" title="Browse" @click="toggleSelect('browse')" />
    <q-tab name="toc" icon="list" title="Table of contents" @click="toggleSelect('toc')" />
    <q-tab name="bookmarks" icon="bookmark" title="Bookmarks" @click="toggleSelect('bookmarks')" />
    <q-tab name="config" icon="settings" title="Config" @click="toggleSelect('config')" />
  </q-tabs>
  <div>
  <Transition name="slide" >
    <q-tab-panels v-model="tab" v-if="tab?.length">
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
  </div>
</template>
  
<script setup lang=ts>
import Live from 'src/Book/Live.vue';
import Bookmarks from 'src/Bookmarks/Bookmarks.vue';
import Explorer from 'src/Library/Explorer.vue';
import { ref, watch } from 'vue'
import TOCVue from 'src/TOC/TOC.vue';
import { QTabs } from 'quasar';
import SettingsPage from 'src/settings/SettingsPage.vue';
const tab = ref<string | undefined>("")

const isSelected = ref(false);

function toggleSelect(tabName: string) {
  console.log({ tabName });
  if (tabName === tab.value) {
    isSelected.value = true
  }
}

watch(tab, it => {
  if (typeof it === "string") {
    isSelected.value = false
  }
})

watch(isSelected, n => {
  console.log({ n });
  if (n === true) {
    tab.value = undefined
    isSelected.value = false
  }
})
</script>
<style lang="sass">
@use "../sass/scrollbar"
#q-app
  display: grid
  grid-template-columns: auto 1fr
</style>
<style lang=sass scoped>
.column
    display: flex
    flex-direction: column
.row
    display: flex
.q-page-container
  width: 100%

.q-drawer, .q-tabs
  position: sticky
  top: 0
  max-height: 100dvh
.q-tab-panels
  z-index: 1
  width: 30vw
  position: fixed
  height: 100%
  border-right: 2px solid black
.q-tab-panel
  padding: 1vw 1vh
.q-tabs
  z-index: 2

.slide-enter-active,
.slide-leave-active
  transition: all 100ms ease-in

.slide-enter-from,
.slide-leave-to 
  transform: translateX(-30vw)
  opacity: 0
</style>