<template>
<div class="welcome-page">
    Press: <br>
    <span>
    <kbd>B</kbd> - Show bookmarks
    </span>
    <span>
    <kbd>C</kbd> - Show TOC
    </span>
    <span>
    <kbd>F</kbd> - Show File explorer
    </span>
</div>
</template>
<script setup>

</script>
<style lang='sass' scoped>
.welcome-page
    height: -webkit-fill-available
    display: flex
    justify-content: center
    flex-direction: column
    row-gap: 2vh
kbd
    border: 1px solid black
    padding: 1px 1vw
    border-radius: 10%

</style>