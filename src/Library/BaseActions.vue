<template>
    <q-btn-group spread style="position: sticky; top:0">
        <slot name="before"></slot>
        <q-btn color="primary" @click="chooser?.click()" title="Open an EPUB" icon-right="book">
            Open
        </q-btn>
        <slot></slot>
        <input type=file hidden ref=chooser @change=selectFile :accept="INFO.MIME">
    </q-btn-group>
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
