<template>
    <q-menu touch-position auto-close>
        <q-list>
            <q-item v-for="item of items" clickable :key="item.label" @click="item.cb">
                <q-item-section avatar>
                    <q-icon :name="item.icon">
                    </q-icon>
                </q-item-section>
                <q-item-section>
                    {{ item.label }}
                </q-item-section>
            </q-item>
        </q-list>
    </q-menu>
</template>
<script setup lang=ts>
import { BookmarkController } from 'src/Bookmarks';
import { stopReading, startReading } from 'src/TTS';
import { narrator } from 'src/TTS/Narrator';

const items = [
    {
        label: "Read aloud",
        icon: "campaign",
        cb() {
            stopReading()
            startReading()
        }
    },
    {
        label: "Bookmark",
        icon: "bookmark_add",
        cb() {
            BookmarkController.toggle(
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
