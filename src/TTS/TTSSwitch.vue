<template>
    <q-item v-if="status != Status.UNSUPPORTED">
        <q-item-label header>
            Panel:
        </q-item-label>
        <q-toggle 
        :true-value="Status.ON"
        :false-value="Status.OFF"
        :label="status == Status.ON ? 'displayed' : 'hidden'" v-model="status">
        </q-toggle>
    </q-item>
    <q-item v-else>
        Text-To-Speech API is unsupported by your browser
    </q-item>
</template>
<script setup lang="ts">
import { status, Status } from "./voice";
</script>
