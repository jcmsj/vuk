<template>
    <q-item>
        <q-item-label header>
            Panel:
        </q-item-label>
        <q-toggle 
        :true-value="Status.ON"
        :false-value="Status.OFF"
        :label="label" v-model="status">
        </q-toggle>
    </q-item>
    <!-- <q-item v-else>
        Text-To-Speech API is unsupported by your browser
    </q-item> -->
</template>
<script setup lang="ts">
import { computed } from "vue";
import { status, Status } from "./voice";
const label = computed(() => status.value == Status.ON ? "displayed" : "hidden")
</script>
