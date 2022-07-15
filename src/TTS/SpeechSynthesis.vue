<template>
<section>
    <div>&#x1F50A;</div>
    <MediaControls />
    <div
        class="settings"
        @click="toggleops"
        title="voice settings"
    >
        &#9881;
    </div>
    <Settings class="pop-up"
        :active="showOps"
    />
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
    justify-content: space-between
    background-color: var(--color-1)
    padding: 3px
    font-size: 1.7rem
    color: var(--color-3)
.pop-up
    font-size: smaller
    padding: 1vh 1vw
    background-color: inherit
    display: none
    position: absolute
    right: 0
    top: 7vh
    color: var(--color-3)
    flex-direction: column

    @include active
        display: flex

.settings
    justify-self: flex-end
    cursor: pointer
</style>