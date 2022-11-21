<template>
    <q-list bordered>
        <q-item-label header>
            Book
        </q-item-label>
        <VLoader />
        <q-separator />
        <q-item-label header>
            Application
        </q-item-label>
        <ThemeSwitcher />
        <Versions />
    </q-list>
</template>
<script setup lang=ts>
import Versions from "./Versions.vue"
import VLoader from "./loader.vue" 
import ThemeSwitcher from "./ThemeSwitcher.vue"
</script>