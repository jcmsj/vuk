<template>
    <lazy-loader>
        <div @mouseup="target.identify" id="__live" ref="view" @click="anchorClicked">
            <v-page v-for="page in pages" :key="page.id" :page="page" />
            <context-menu />
        </div>
    </lazy-loader>
</template>
<script setup>
/**
 TS DOESNT WORK {@see LazyLoader.vue}
 *  */
import { anchorClicked } from "../Library/anchorClicked"
import { target } from "./Target";
import { view, pages } from "./Pages"
import ContextMenu from "./ContextMenu.vue";
import LazyLoader from "./LazyLoader.vue";
import VPage from "./VPage.vue";
</script>
<style lang='sass' scoped>
    
#__live 
    flex: 1
    margin: 1vh 1vw
</style>