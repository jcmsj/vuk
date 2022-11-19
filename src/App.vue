<template>
  <router-view />
</template>

<script setup lang="ts">
import { loadBookFromLauncher } from './Library/fileReader';

loadBookFromLauncher()
</script>
