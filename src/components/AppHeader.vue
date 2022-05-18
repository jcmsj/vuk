<script setup>
const emits = defineEmits(["toggle-s-panel"]);

</script>
<template>
    <header>
        <nav>
            <button
            @click="emits('toggle-s-panel')"
            >
                ☰
            </button>
        </nav>
    </header>
</template>

<style lang="sass">
header
    position: sticky
    top: 0
    background-color: white
    padding: 1vh 1vw
    align-self: flex-start
</style>