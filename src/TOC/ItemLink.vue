<template>
    <router-link :to="'/#' + item.id" @click="anchorClicked($event, item.id)">
        {{ item.title }}
    </router-link>
</template>
<script setup lang="ts">
import { Chapter } from '@jcsj/epub/lib/traits';
import { anchorClicked } from "../Library/anchorClicked"


defineProps<{
    item: Chapter
}>()
</script>
