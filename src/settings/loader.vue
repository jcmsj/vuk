<template>
    <q-item>
        <q-item-label header>
            Load method:
        </q-item-label>
        <q-item-section>
            <select name="load-method" v-model="loadMethod">
                <option v-for="(key, v) in LoadMethod" :key="key" :value="v">
                    {{ key }}
                </option>
            </select>
        </q-item-section>
    </q-item>
</template>
<script setup lang=ts>
import { loadMethod, LoadMethod } from "../Library/Load"

</script>
<style scoped lang=sass>

</style>
