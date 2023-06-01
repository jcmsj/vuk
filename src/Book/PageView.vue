<template>
    <lazy-loader>
        <div @mouseup="identifySpeechTarget" id="__live" ref="view" @click="anchorClicked">
            <v-page v-for="page in pages" :key="page.id" :page="page" />
            <context-menu />
        </div>
    </lazy-loader>
</template>
<script setup>
import { anchorClicked } from "../Library/anchorClicked"
import { identifySpeechTarget } from "../TTS"
import { view, pages } from "./Pages"
import ContextMenu from "./ContextMenu.vue";
import VPage from "./VPage.vue";
import LazyLoader from "./LazyLoader.vue";
</script>
<style lang='sass' scoped>
    
#__live 
    flex: 1
    margin: 1vh 1vw
</style>