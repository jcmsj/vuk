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
        <q-item-label header>
            Narrator
        </q-item-label>
        <TTSSwitch />
        <Versions />
        <q-separator />
    </q-list>
</template>
<script setup lang=ts>
import Versions from "./Versions.vue"
import VLoader from "./loader.vue"
import ThemeSwitcher from "./ThemeSwitcher.vue"
import TTSSwitch from "src/TTS/TTSSwitch.vue";
</script>