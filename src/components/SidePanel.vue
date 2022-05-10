<template>
  <aside>
    <vLibrary
      :active="tabIndex == 0"
    ></vLibrary>
    <vTOC
      :active="tabIndex == 1"
      >
    </vTOC>
  </aside>
</template>
<script setup>
import {ref} from "vue"
import {onKeyUp} from "@vueuse/core"
import vTOC from "./TOC.vue"
import vLibrary from "./BookLibrary.vue";
import {Book} from "../modules/Book"

const isDisplayed = ref(false);
const tabIndex = ref(0);

const emits = defineEmits(["toggle-s-panel", "hide-s-panel", "show-s-panel"])
onKeyUp("f", e => {
  changeTab(0)
}, {target:document})

onKeyUp("c", e => {
  changeTab(1)
}, {target:document})

onKeyUp("Escape", e => {
    emits("hide-s-panel")
}, {target:document})

function changeTab(i) {
    tabIndex.value = i;
    emits("show-s-panel")
}

</script>
<style lang='sass' scoped>
aside
    padding: 1vh 1vw
    background-color: wheat
    max-width: 30vw
    overflow-y: auto
    display: none
    resize: horizontal

    /* The active state is controlled from App.vue am thinking how to fix this */
    &[active="true"]
        display: flex
    & > *
        display: none
    & > *[active="true"]
        display: block

</style>