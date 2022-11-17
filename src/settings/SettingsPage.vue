<template>
    <q-list bordered>
        <q-item-label header>
            Book config
        </q-item-label>
        <VLoader />
        <q-separator />
        <q-item-label header>
            Versions
        </q-item-label>
        <q-item>
            <q-item-section>
                Vuk v{{ version }}
            </q-item-section>
        </q-item>
        <q-item>
            <q-item-section>
                Quasar v{{ $q.version }}
            </q-item-section>
        </q-item>
    </q-list>
</template>
<script setup lang=ts>
import { version } from "../../package.json"
import VLoader from "./loader.vue"

</script>