<template>
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onBeforeMount, watch } from 'vue';
import { RouterView } from 'vue-router';
import { loadBookFromLauncher } from './Library/fileReader';
import {dark} from "./settings/Theme"
loadBookFromLauncher()
const q = useQuasar()

onBeforeMount(() => {
  q.dark.set(dark.value)
})

watch(dark, t => {
    q.dark.set(t)
})
</script>
