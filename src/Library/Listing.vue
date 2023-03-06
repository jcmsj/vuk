<template>
    <q-list>
        <VItem v-if="library.root && !library.inRoot" @click="library.goto(library.root)">
            /
        </VItem>
        <VItem v-if="library.levels.length" @click="library.moveUp()">
            ../
        </VItem>
    </q-list>
    <VItem v-for="(item, dirname) of sorter.dirs" :key="dirname" @click="library.goto(item)">
        {{ dirname }}
    </VItem>
    <VItem name="book"
    v-for="(item, name) of sorter.books" :key="name" @click="emit('open-book', item)"
    >
        {{ name }}
    </VItem>
</template>
<script setup lang=ts>
import { RxDir, RxSorter } from './RxDir';
import VItem from "./VItem.vue"
const emit = defineEmits(["open-book"])

const { sorter, library } = defineProps<{
    sorter: RxSorter<any, any>,
    library: RxDir<any>
}>()

</script>