<template>
  <q-item clickable :is="RouterLink" :to="'/' + bookmark.selector" :bind="$props">
    <q-item-section>
      {{ bookmark.text }} - {{ bookmark.percentage }}%
    </q-item-section>
    <slot></slot>
  </q-item>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Bookmark } from '.';
defineProps<{ bookmark: Bookmark }>()
</script>  
