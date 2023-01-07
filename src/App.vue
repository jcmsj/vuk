<template>
  <router-view />
</template>
<script setup lang="ts">
import { Dark } from 'quasar';
import { onBeforeMount, watch } from 'vue';
import { RouterView } from 'vue-router';
import loadBookFromElectron from './Library/electronLauncher';
import { loadBookFromLauncher } from './Library/fileReader';
import { dark } from "./settings/Theme"

//Do these as early as possible
loadBookFromLauncher()
loadBookFromElectron()

onBeforeMount(() => {
  Dark.set(dark.value)
})

watch(dark, t => {
  Dark.set(t)
})
</script>