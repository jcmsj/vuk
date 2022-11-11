<template>
  <q-layout view="hhh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer elevated>
        <q-tabs
          v-model="tab"
          align="center"
        >
          <q-route-tab 
            name="browse" 
            icon="folder"
            label="Browse"
            to="/"
          />
          <q-route-tab
            name="library"
            icon="shelves"
            label="Library"
            to="library"
          />
          <q-route-tab
            name="config"
            icon="settings"
            label="Config"
            to="config"
          />
          
        </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const tab = ref("")

</script>
