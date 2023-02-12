<template>
    <q-item>
        <q-item-label header>
            Panel:
        </q-item-label>
        <q-toggle :label="reveal ? 'displayed' : 'hidden'" v-model="reveal">
        </q-toggle>
    </q-item>
</template>
<script setup lang="ts">
import reveal from "./reveal"
</script>