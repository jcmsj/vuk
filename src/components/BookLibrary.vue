<template>
<div>
    Library
    <div v-if="props.titles == []">Library is empty!</div>
    <div v-else>
        <div v-for="title in props.titles" :key="title" @click="continueReading(title)">
            {{title}}
        </div>
    </div>
</div>

</template>
<script setup>
import { onMounted } from "vue"

const props = defineProps({
    "titles" : {
        type: Array,
        default() {
            return []
        }
    }
})

const emits = defineEmits(["continue-reading"])

function continueReading(title) {
    emits("continue-reading", title)
}

onMounted(() => {
    console.log(props.titles);
})
</script>
<style lang='sass'>

</style>