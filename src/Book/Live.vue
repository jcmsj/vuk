<template>
    <article ref="mainElem">
        <EPUBStyle />
        <SpeechSynthesis />
        <PageView />
    </article>
</template>
<script setup lang="ts">
import { mainElem } from "../lib/useMainElem"
import SpeechSynthesis from "../TTS/SpeechSynthesis.vue"
import EPUBStyle from "./EPUBStyle.vue";
import PageView from "./PageView.vue";
import "../Bookmarks/background"; // For Side effects
</script>
<style lang='sass' scoped>
    
article
    overflow-y: auto
    height: 100%
</style>
