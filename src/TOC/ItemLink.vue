<template>
    <router-link :to="'/#' + id" @click="anchorClicked($event, id)">
        {{ title }}
    </router-link>
</template>
<script setup lang="ts">
import { anchorClicked } from "../Library/anchorClicked"

defineProps<{id:string, title:string}>()
</script>
