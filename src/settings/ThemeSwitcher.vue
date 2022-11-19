<template>
<q-item>
    <q-item-label header>
        Color theme: 
    </q-item-label>
    <q-item-section>
        <q-toggle 
            :label="dark === true ? 'dark':'light'"
            v-model="dark" 
            @click="q.dark.toggle" 
            :icon="dark === true ? 'nightlight': 'light_mode'"
        />
    </q-item-section>
</q-item>
</template>
<script setup lang=ts>
import { QItem, QItemLabel, QToggle, useQuasar } from 'quasar';
import {dark} from "./Theme"
const q = useQuasar()

</script>