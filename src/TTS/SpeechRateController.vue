<template>
    <div>
        <label for="speech-rate">
            Speech rate:
            {{ speech_rate }}
        </label>
        <input type="range" name="speech-rate" list="ticks" :min="min" :max="max" :step="STEP" v-model="speech_rate">
        <datalist id="ticks">
            <!-- add a label every 0.25 -->
            <option v-for="option in OPTIONS" :value="option" ></option>
        </datalist>
    </div>
</template>
<script setup>
import { range } from "src/lib/range";
import { speech_rate, min, max } from "./speech_rate";
import { onKeyUp } from "@vueuse/core";
const STEP = 0.05;
const OPTIONS = Object.freeze(range(min, max, STEP));

</script>
<style lang='sass' scoped>
@import "src/sass/mixins"

div
    @include lex
    
input[type="range"]
    padding: 2vh 1vw
</style>
