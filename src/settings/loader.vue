<template>
    <q-item>
        <q-item-label header>
            Load method:
        </q-item-label>
        <q-item-section>
            <select name="load-method" ref=elem @change="e => loadMethod = elem.value" :value="loadMethod">
                <option v-for="(key, v) in LoadMethod" :key="key" :value="v">
                    {{ key }}
                </option>
            </select>
        </q-item-section>
    </q-item>
</template>
<script setup lang=ts>
import { ref } from "vue"
import { loadMethod, LoadMethod } from "../Library/Load"
const elem = ref()

</script>
<style scoped lang=sass>

</style>