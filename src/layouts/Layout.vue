<template>
  <q-tabs :vertical="onNoTouch" align="left" switch-indicator shrink content-class="sidebar"
    active-color="primary" class="bg-secondary text-grey-9 shadow-3">
    <toggle-tab exact :inactive="hotkeys.f" if-active="/" icon="folder" title="Browse" />
    <toggle-tab exact :inactive="hotkeys.t" if-active="/" icon="list" title="Table of contents" />
    <toggle-tab exact :inactive="hotkeys.b" if-active="/" icon="bookmarks" title="Bookmarks" />
    <toggle-tab exact :inactive="hotkeys.c" if-active="/" icon="settings" title="Config"  />
  </q-tabs>
  <main>
    <RouterView v-slot="{ Component, route }">
      <Transition name="slide">
        <q-card v-if="route.path != '/'" class="panel" :class="{'shadow-4': onNoTouch}">
          <component :is="Component" :key="route.path" />
        </q-card>
      </Transition>
    </RouterView>
    <Live />
  </main>
</template>
  
<script setup lang=ts>
import Live from 'src/Book/Live.vue';
import { useEventListener, useMediaQuery } from '@vueuse/core';
import { toggleSelect, toHome } from "./Tab"
import { RouterView } from 'vue-router';
import { QTabs, QCard } from 'quasar';
import { Transition } from 'vue';
import { log } from 'src/settings/DevMode';
import ToggleTab from './ToggleTab.vue';
/* if device has no touch screen */
const onNoTouch = useMediaQuery("(any-pointer: fine) and (min-width: 1024px)");

const hotkeys = Object.freeze({
  f: "browse",
  b: "bookmarks",
  t: "toc",
  c: "config",
})

useEventListener("keyup",  e => {
  if (e.target instanceof HTMLInputElement) {
    return 
  }

  log(e.key)  

  switch (e.key) {
    case "Escape":
      toHome()
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
  overflow-y: hidden
  position: fixed
  height: 100%
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

main
  grid-area: book
  overflow-y: hidden
  max-width: 100vw
.q-tabs
  position: sticky
  grid-area: nav

  @include mobile
    bottom: 0

  @include desk
    top: 0

.panel
  z-index: 1
  height: 100%
  width: 100%
  position: sticky
  top: 0
  overflow-y: auto
  padding: 1vh 1vw
  @include desk
    width: 30vw
    resize: horizontal
    position: fixed
.q-tabs
  z-index: 2

.slide-enter-active,
.slide-leave-active
  transition: all 50ms

.slide-enter-from,
.slide-leave-to 
  opacity: 0
  transform: translateY(30vh)
  @include desk
    transform: translateX(-30vw)

</style>
