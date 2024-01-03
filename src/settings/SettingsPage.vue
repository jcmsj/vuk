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
        <q-separator />
        <q-item-label header>
            Narrator
        </q-item-label>
        <TTSSwitch />
        <q-separator />
        <q-item-label header>
            TOC
        </q-item-label>
        <TOCDepth />
        <q-separator />
        <q-item-label header>
            Dev Settings
        </q-item-label>
        <DevModeSwitcher />
        <q-item>
            <!-- reload btn -->
            <q-btn v-if="DevMode" color="primary" @click="reload" title="Reload the current book" icon-right="refresh">
                Reload Epub
            </q-btn>
        </q-item>
        <q-separator />
        <Versions />
    </q-list>
</template>
<script setup lang=ts>
import Versions from "./Versions.vue"
import VLoader from "./loader.vue"
import ThemeSwitcher from "./ThemeSwitcher.vue"
import TTSSwitch from "src/TTS/TTSSwitch.vue";
import DevModeSwitcher from "./DevModeSwitcher.vue";
import TOCDepth from "./TOCDepth.vue"
import { reload } from "src/Library/fileReader"
import { DevMode } from "./DevMode"
</script>
