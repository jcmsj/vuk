<template>
    <q-route-tab v-bind="$props" :to="to"  />
</template>
<script setup lang="ts">
import {QRouteTabProps} from "quasar/dist/types"
import { RouteRecordName, useRoute } from 'vue-router';
import { computedEager } from '@vueuse/core';

interface ToggleTabProps extends Omit<QRouteTabProps, "to"> {
    ifActive:RouteRecordName, inactive:RouteRecordName
}
const {ifActive, inactive} = defineProps<ToggleTabProps>()
const route = useRoute()
const to = computedEager(() => route.name === inactive ? ifActive : inactive)
</script>
