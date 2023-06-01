<template>
    <q-item clickable>
        <q-item-section avatar>
            <q-icon :name="item.icon" />
        </q-item-section>
        <q-item-section>
            {{ item.label }}
        </q-item-section>
    </q-item>
</template>
<script setup lang=ts>
import { MenuItemProps } from './MenuItemProps';

const {item} = defineProps<{item:MenuItemProps}>();
</script>