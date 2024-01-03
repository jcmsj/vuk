<template>
    <q-btn icon="settings" title="voice settings">
        <q-menu self="top middle">
            <q-list>
                <q-item>
                    <SpeechRateController />
                </q-item>
                <q-item>
                    <VoiceSelector />
                </q-item>
            </q-list>
        </q-menu>
    </q-btn>
</template>
<script setup>
import SpeechRateController from "./SpeechRateController.vue"
import VoiceSelector from "./VoiceSelector.vue"
import { onBeforeMount, watch } from "vue";
import { useLocalStorage } from "@vueuse/core";
import {prefVoice} from "./voice";
import DevMode from 'src/settings/DevMode';
</script>
<style lang="sass">
@import "src/sass/media_queries"

.q-menu
    margin: 1vh 1vw
</style>
