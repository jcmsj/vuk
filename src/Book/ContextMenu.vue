<template>
    <q-menu touch-position auto-close>
        <q-list>
            <menu-item v-for="item of items" 
            :key="item.label" 
            :item="item"
            @click="item.cb"
            ></menu-item>
        </q-list>
    </q-menu>
</template>
<script setup lang=ts>
import { toggle } from 'src/Bookmarks/useBook';
import { narrator } from 'src/TTS/Narrator';
import MenuItem from './MenuItem.vue';
import { MenuItemProps } from './MenuItemProps';

const items: MenuItemProps[] = [
    {
        label: "Read aloud",
        icon: "campaign",
        cb() {
            narrator.stop();
            narrator.start();
        }
    },
    {
        label: "Bookmark",
        icon: "bookmark_add",
        cb() {
            toggle(
                narrator.target!
            )
        }
    },
    {
        label: "Copy",
        icon: "content_copy",
        cb() { }
    }
]

</script>
