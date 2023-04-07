<template>
    <q-menu touch-position auto-close>
        <q-list>
            <q-item v-for="item of items" clickable :key="item.label" @click="item.cb">
                <q-item-section avatar>
                    <q-icon :name="item.icon" />
                </q-item-section> 
                <q-item-section>
                    {{ item.label }}
                </q-item-section>             
            </q-item>
        </q-list>
    </q-menu>
</template>
<script setup lang=ts>
import { toggle } from 'src/Bookmarks/useBook';
import { narrator } from 'src/TTS/Narrator';

interface MenuItem {
    label: string,
    icon: string,
    cb: () => void
}

const items: MenuItem[] = [
    {
        label: "Read aloud",
        icon: "campaign",
        cb() {
            narrator.stop()
            narrator.start()
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
