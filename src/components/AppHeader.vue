<script setup>
import {ref} from "vue"
const emits = defineEmits(["nav-toggled"]);

const t = ref("")
</script>
<template>
    <header >
    <div 
        ref="t"
        class="btn" 
        >Test
    </div>
        Header
        <nav>
            <div 
                class="btn" 
                @click="emits('nav-toggled')">
                ☰
            </div>
            <slot />
        </nav>
    </header>

</template>

<style lang="sass" scoped>
header
    position: sticky
    top: 0
    background-color: white
    width: 100%

.btn
    cursor: pointer
</style>