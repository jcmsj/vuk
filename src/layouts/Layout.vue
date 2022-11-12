<template>
  <q-layout view="hhh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer elevated>
        <q-tabs
          align="center"
        >
          <q-route-tab 
            name="browse" 
            icon="folder"
            title="Browse"
            to="/"
            exact
          />
          <q-route-tab 
            name="read" 
            icon="auto_stories"
            title="read"
            to="read"
            exact
          />
          <q-route-tab
            name="library"
            icon="shelves"
            title="Library"
            to="library"
            exact
          />
          <q-route-tab
            name="config"
            icon="settings"
            title="Config"
            to="config"
            exact
          />
          
        </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
</script>