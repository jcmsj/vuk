<template>
    <component is="style">
        {{epubStyle}}
    </component>
</template>
<script setup lang=ts>
import { book } from 'src/Bookmarks/useBook';
import { instance } from 'src/lib/EnhancedEpub';
import { log } from 'src/settings/DevMode';
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
            rules = "";
            selector= "";
        }
    }

    epubStyle.value = scoped;
})

watch(() => book.title, async (it) => {
    if (!instance.value || !it)
        return;
    const styles = instance.value.matchAll(/style|css/)
    log(styles)
    
    rawStyle.value = (await Promise.all(
        styles.map(s => instance.value?.getContentRaw(s.id))))
        .join("\n");
})
</script>
