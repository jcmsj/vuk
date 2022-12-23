<template>
    <q-btn-group spread>
        <slot name="before"></slot>
        <q-btn color="primary" @click="chooser?.click()" title="Open an EPUB" icon-right="book">
            Open
        </q-btn>
        <slot></slot>
    </q-btn-group>
    <input type=file hidden ref=chooser @change=selectFile :accept="INFO.MIME">
</template>
<script setup lang=ts>
import { ref } from 'vue';
import { INFO } from '@jcsj/epub/lib/Reader';
import { loadBookFromFile } from './fileReader';
const chooser = ref<HTMLInputElement>();

async function selectFile(e: any) {
    if (chooser.value?.files?.length) {
        loadBookFromFile(chooser.value.files[0])
    }
}
</script>