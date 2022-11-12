<template>
    <div>
        <label for="speech-rate">
            Speech rate:
            {{ speech_rate }}
        </label>
        <input type="range" name="speech-rate" list="ticks" :min="min" :max="max" step="0.25" :value="speech_rate"
            @change="e => speech_rate = e.target.value">
        <datalist id="ticks">
            <option :value="min" :label="min"></option>
            <option value="1" label="1"></option>
            <option value="2" label="2"></option>
            <option :value="max" :label="max"></option>
        </datalist>
    </div>
</template>
<script setup>
import { speech_rate, min, max } from "./speech_rate";

</script>
<style lang='sass' scoped>
@import "src/sass/mixins"

div
    @include lex
    
input[type="range"]
    padding: 2vh 1vw
</style>