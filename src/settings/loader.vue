<template>
<span>
<label for="load-method">Load method:</label>
<select 
    name="load-method" 
    ref=elem
    @change="change"
>
    <option 
    v-for="(key, v) in LoadMethod"
    :key="key"
    :value="v"
    >
    {{key}}
    </option>
</select>
</span>
</template>
<script setup lang=ts>
import {ref} from "vue"
import {loadMethod, LoadMethod} from "../Library/Load"

const elem = ref()

function change() {
    loadMethod.value =  elem.value.value
}
</script>
<style scoped lang=sass>
span
    display: block
</style>