<template>
    <q-item>
        <q-item-label header>
            Reduce logs:
        </q-item-label>
        <q-item-section>
            <q-toggle :label="DevMode ? 'on' : 'off'" v-model="DevMode" :icon="DevMode ? 'on' : 'off'" />
        </q-item-section>
    </q-item>
</template>
<script setup lang=ts>
import { DevMode } from './DevMode';

</script>