<template>
<q-item>
    <q-item-label header>
        Color theme: 
    </q-item-label>
    <q-item-section>
        <q-toggle 
            :label="dark ? 'dark':'light'"
            v-model="dark" 
            :icon="dark ? 'nightlight': 'light_mode'"
        />
    </q-item-section>
</q-item>
</template>
<script setup lang=ts>
import {dark} from "./Theme"

</script>