<template>
    <q-item>
        <q-item-label header>
            Reduce logs:
        </q-item-label>
        <q-item-section>
            <q-toggle :label="devMode" v-model="DevMode" :icon="devMode" />
        </q-item-section>
    </q-item>
</template>
<script setup lang=ts>
import { computed } from 'vue';
import { DevMode } from './DevMode';

/* Currently, both the label and icon text are the same */
const devMode = computed(() => DevMode.value ? 'on':'off');
</script>
