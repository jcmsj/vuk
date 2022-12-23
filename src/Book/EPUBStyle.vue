<template>
    <component is="style">
        {{epubStyle}}
    </component>
</template>
<script setup lang=ts>
import { book } from 'src/Bookmarks/useBook';
import { instance } from 'src/lib/EnhancedEpub';
import { watch } from 'vue';
import { rawStyle, epubStyle, prefix } from './styles';

//TODO: Delegate to worker
watch(rawStyle, style => {
    if (!style) {
        epubStyle.value = "" //Reset
        return;
    }

    let selector:string = "";
    let rules:string = "";
    let scoped = "";
    for (const c of style) {
        if (rules.length || c === "{") {
            rules += c;
        } else {
            selector += c;
        }

        if (c === "}") {
            scoped += prefix + selector + rules;
            rules = ""
            selector= ""
        }
    }

    epubStyle.value = scoped;
})

watch(() => book.title, async (it) => {
    if (!it)
        return;
    const styles = instance?.matchAll(/style|css/)
    console.log(styles);
    
    if (styles?.length) {
        rawStyle.value = await instance.getContentRaw(styles[0].id);
    }
})
</script>