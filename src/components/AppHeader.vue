<script setup>
const emits = defineEmits(["toggle-s-panel"]);

</script>
<template>
    <header>
        Header
        <nav>
            <button
            @click="emits('toggle-s-panel')"
            >
                ☰
            </button>
        </nav>
        <a href="#id_cover_xhtml">Test</a>

    </header>
</template>

<style lang="sass" scoped>
header
    position: sticky
    top: 0
    background-color: white
    width: 100%
</style>