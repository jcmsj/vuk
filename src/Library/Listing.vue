<template>
    <q-list>
        <q-item clickable v-if="library.root && !library.inRoot" @click="library.goto(library.root)">
            <q-item-section avatar>
                <q-icon color="primary" name="folder" />
            </q-item-section>
            <q-item-section>
                /
            </q-item-section>
        </q-item>
        <q-item v-if="library.levels.length" clickable @click="library.moveUp()">
            <q-item-section avatar>
                <q-icon color="primary" name="folder" />
            </q-item-section>
            <q-item-section>
                ../
            </q-item-section>
        </q-item>
    </q-list>
    <q-item v-for="(item, dirname) of sorter.dirs" clickable :key="dirname" @click="library.goto(item)">
        <q-item-section avatar>
            <q-icon color="primary" name="folder" />
        </q-item-section>
        <q-item-section>
            {{ dirname }}
        </q-item-section>
    </q-item>
    <q-item v-for="(item, name) of sorter.books" clickable :key="name" @click="emit('open-book', item)">
        <q-item-section avatar>
            <q-icon color="primary" name="book" />
        </q-item-section>
        <q-item-section>
            {{ name }}
        </q-item-section>
    </q-item>
</template>
<script setup lang=ts>
import { RxDir, RxSorter } from './RxDir';

const emit = defineEmits(["open-book"])

const { sorter, library } = defineProps<{
    sorter: RxSorter<any, any>,
    library: RxDir<any>
}>()

</script>