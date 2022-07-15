<template>
<div>
    <label for="speech-rate">
            Speech rate: 
    {{speech_rate.value}}
    </label>
    <input type="range"
        name="speech-rate"
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
import speech_rate from "./speech_rate";

</script>
<style lang='sass' scoped>
@import "src/sass/mixins"

div
    @include lex
    
input[type="range"]
    padding: 2vh 1vw
</style>