<template>
  <router-view />
</template>
<script setup lang="ts">
import { Dark } from 'quasar';
import { onBeforeMount, watch } from 'vue';
import { RouterView } from 'vue-router';
import { dark } from "./settings/Theme"

onBeforeMount(() => {
  Dark.set(dark.value)
})

watch(dark, t => {
  Dark.set(t)
})
</script>