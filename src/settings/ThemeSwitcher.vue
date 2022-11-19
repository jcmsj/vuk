<template>
<q-item>
    <q-item-label header>
        Color theme: 
    </q-item-label>
    <q-item-section>
        <q-toggle 
            :label="q.dark.mode === true ? 'dark':'light'"
            v-model="q.dark.mode" 
            @click="q.dark.toggle" 
            :icon="q.dark.mode === true ? 'nightlight': 'light_mode'"
        />
    </q-item-section>
</q-item>
</template>
<script setup lang=ts>
import { useLocalStorage, useMediaQuery } from '@vueuse/core';
import { QItem, QItemLabel, QToggle, useQuasar } from 'quasar';
import { onBeforeMount, watch } from 'vue';
const q = useQuasar()
const prefersDark = useMediaQuery("prefers-color-scheme: dark")
const dark = useLocalStorage("theme", q.dark.mode)
/* onBeforeMount(() => {
    q.dark.set(dark.value)
}) */
watch(prefersDark, t => {
    dark.value = t
    console.log(t);
})
</script>