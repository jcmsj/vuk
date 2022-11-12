<template>
    <section>
        <q-btn-group class="controls">
            <MediaControls />
            <Settings />
        </q-btn-group>
    </section>
</template>
<script setup>
import { ref } from "vue";
import MediaControls from "./MediaControls.vue"
import Settings from "./Settings.vue"

const
    showOps = ref(false)
    ;

function toggleops() {
    showOps.value = !showOps.value
}

</script>
<style lang="sass">

.s-read
    background-color: #53e7f5

span.current-word
    background-color: #FFFF00
</style>

<style lang="sass" scoped>
@import "src/sass/media_queries"

section
    position: sticky
    top: 0
    display: flex
    justify-content: center
    background-color: var(--color-1)
    padding: 3px
    font-size: 1.7rem
    color: var(--color-3)
    width: 100%

.q-btn-group
    margin: 1vh 1vw
    padding: 1vh 1vw
</style>