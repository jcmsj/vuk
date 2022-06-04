<template>
<div>
    <span>
    Speed: 
    {{speech_rate.value}}
    </span>
    
    <input type="range"
        list="ticks"
        :min="speech_rate.min"
        :max="speech_rate.max"
        step="0.25"
        :value="speech_rate.value"
        @change="e => speech_rate.set(e.target.value)"
    >
    <datalist id="ticks">
        <option :value="speech_rate.min" :label="speech_rate.min"></option>
        <option value="1" label="1"></option>
        <option value="2" label="2"></option>
        <option :value="speech_rate.max" :label="speech_rate.max"></option>
    </datalist>
</div>
</template>
<script setup>
import {speech_rate} from "./speech_rate";

</script>
<style lang='sass' scoped>
div
    display: flex
    flex-direction: column
    
input[type="range"]
    padding: 3vh 1vw
</style>