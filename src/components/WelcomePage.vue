<template>
<main class="welcome-page">
    <div
        class="no-kb"
    >
        Tap on one of the buttons above.
    </div>
    <div
        class="kb"
    >
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
</main>
</template>
<script setup>

</script>
<style lang='sass' scoped>
.welcome-page
    height: -webkit-fill-available

kbd
    border: 1px solid black
    padding: 1px 1vw
    border-radius: 10%

.kb, .welcome-page
    display: flex
    justify-content: center
    flex-direction: column
    row-gap: 2vh

.kb
    display:  none

@media screen and (hover: hover)
    .no-kb
        display: none

    .kb
        display: flex

</style>