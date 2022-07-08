<template>
<span>
<label for="load-method">Load method:</label>
<select 
    name="load-method" 
    ref=elem
    @change="change(elem.value)"
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
import {onMounted, ref} from "vue"
import {loadMethod, LoadMethod} from "../Library/Load"

const elem = ref()
const key = "load-method"
function change(v:LoadMethod) {
    loadMethod.value = v
    localStorage.setItem(key, v)
}

onMounted(() => {
    const maybeMode = localStorage.getItem(key)
    if (maybeMode == null)
        return
        
    change(maybeMode as unknown as LoadMethod)

    elem.value.value = loadMethod.value
})
</script>
<style scoped lang=sass>
span
    display: block
</style>