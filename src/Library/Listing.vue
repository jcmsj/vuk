<template>
    <q-list>
        <q-input v-model="target" clearable autofocus />
        <VItem v-if="!fs.inRoot" @click="fs.goto(fs.root)">
            /
        </VItem>
        <VItem v-if="!fs.inRoot" @click="fs.moveUp()">
            ../
        </VItem>
        <VItem v-for="(item, dirname) of sorter.dirs" :key="dirname" item_name="folder" @click="fs.goto(item)"
        :class="{hidden:shouldHide(item)}"
        >
            {{ dirname }}
        </VItem>
        <VItem item_name="book" v-for="(item, name) of sorter.books" :key="name" @click="$emit('open-book', item)"
        :class="{hidden:shouldHide(item)}"
        >
            {{ name }}
        </VItem>
    </q-list>
</template>
<script setup lang=ts>
import { FS, Item, Librarian, Handle } from 'src/fs';
import VItem from "./VItem.vue"
import { computed, ref } from 'vue';
defineEmits<{
    (event: "open-book", item: Item): void
}>();
const target = ref("")
const lower = computed(() => target.value?.toLocaleLowerCase())
const { sorter, fs } = defineProps<{
    sorter: Librarian,
    fs: FS
}>()

function shouldHide(h:Handle) {
    return lower.value?.length && !h.name.toLocaleLowerCase().includes(lower.value)
}
</script>
