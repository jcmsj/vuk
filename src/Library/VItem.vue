<template>
    <q-item clickable @click="$props.onClick">
        <q-item-section avatar>
            <q-icon color="primary" :name="item_name" />
        </q-item-section>
        <q-item-section>
            <slot></slot>
        </q-item-section>
    </q-item>
</template>
<script setup lang="ts">
import { QItemProps } from 'quasar';

interface ItemProps extends QItemProps {
    item_name?:string
}

const {item_name} = withDefaults(
    defineProps<ItemProps>(), 
    {
        item_name: "folder"
    }
);

</script>