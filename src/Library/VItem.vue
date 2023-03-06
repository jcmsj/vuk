<template>
    <q-item clickable :bind="props">
        <q-item-section avatar>
            <q-icon color="primary" :name="name" />
        </q-item-section>
        <q-item-section>
            <slot></slot>
        </q-item-section>
    </q-item>
</template>
<script setup lang="ts">
import { QItemProps } from 'quasar';

interface ItemProps extends QItemProps {
    name?:string
}

const { name, ...props } = withDefaults(
    defineProps<ItemProps>(), 
    {
        name: "folder"
    }
);
</script>