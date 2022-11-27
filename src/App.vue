<template>
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar, Platform } from 'quasar';
import { onBeforeMount, watch } from 'vue';
import { RouterView } from 'vue-router';
import { loadBookFromFile, loadBookFromLauncher } from './Library/fileReader';
import { dark } from "./settings/Theme"
loadBookFromLauncher()
const q = useQuasar()

//Do this as early as possible
if (Platform.is.electron) {
  window.vuk.getLaunchedFile().then(maybeBuffer => {
    if (maybeBuffer) {
      loadBookFromFile(new Blob([maybeBuffer]) as File)
    }
  });
}

onBeforeMount(() => {
  q.dark.set(dark.value)
})

watch(dark, t => {
  q.dark.set(t)
})
</script>
