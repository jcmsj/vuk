<template>
    <q-list>
        <VItem v-if="!fs.inRoot" @click="fs.goto(fs.root)">
            /
        </VItem>
        <VItem v-if="!fs.inRoot" @click="fs.moveUp()">
            ../
        </VItem>
    </q-list>
    <VItem v-for="(item, dirname) of sorter.dirs" :key="dirname"  item_name="folder" @click="fs.goto(item)">
        {{ dirname }}
    </VItem>
    <VItem item_name="book"
    v-for="(item, name) of sorter.books" :key="name" @click="emit('open-book', item)"
    >
        {{ name }}
    </VItem>
</template>
<script setup lang=ts>
import { FS, Item, Librarian } from 'src/fs';
import VItem from "./VItem.vue"
const emit = defineEmits<{
    (event:"open-book", item:Item):void
}>();

const {sorter, fs} = defineProps<{
    sorter: Librarian,
    fs: FS
}>()

</script>