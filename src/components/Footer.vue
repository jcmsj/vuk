<template>
    <footer>
        <SpeechSynthesis></SpeechSynthesis>
    </footer>
</template>

<script setup>
import SpeechSynthesis from './tts/SpeechSynthesis.vue';
</script>
<style lang="sass">
footer
    position: sticky
    bottom: 0
    width: 100%
</style>