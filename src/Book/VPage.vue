<template>
<div class="chapter" v-html="page.html" :id="page.id">

</div>
</template>
<style lang="sass">
/* Important: Unscoped */
@use "../Bookmarks/style"

div.chapter
    min-height: 110vh
    display: flex
    flex-direction: column

    /* Uses is to increase specificity due to chrome vs firefox 
     * :deep doesnt work https://github.com/vuejs/core/issues/6605
     */
    :is(img, svg:has(image))
        /* Sizing */
        object-fit: contain
        max-width: 80% !important
        max-height: 80vh !important
        /* Aligns center */
        margin-inline: auto
        display: block

    :is(h1, h2, h3, h4, h5, h6)
        align-self: center

        //Patch for stylized chapter titles for now
        img
            display: inline
</style>
<script setup lang="ts">
interface Page {
    id: string,
    html: string
}
const { page } = defineProps<{ page: Page }>();
</script>
