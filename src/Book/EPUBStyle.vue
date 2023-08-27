<template>
    <component is="style" v-for="scoped of scopeds">
        {{ scoped }}
    </component>
</template>
<script setup lang=ts>
import { EnhancedEpub, instance } from 'src/lib/EnhancedEpub';
import { log } from 'src/settings/DevMode';
import { computedAsync } from '@vueuse/core';
import { className } from "src/TTS/constants";

const SELECTOR_PREFIX = `#__live > .${className.chapter} `;
const scopeds = computedAsync(async () => {
    if (instance.value) {
        console.log("Searching for CSS");
        return (await searchCSS(instance.value))
            .map(addSelectorPrefix);
    }
    return []
});

//TODO: Delegate to worker
const SELECTOR_REGEX = /.+(\n|\r)*{/g
function addSelectorPrefix(raw: string = "") {
    return raw.replaceAll(SELECTOR_REGEX, (selector) => SELECTOR_PREFIX + selector)
}

async function searchCSS(epub: EnhancedEpub) {
    const styles = epub.matchAll(/style|css/)
    log(styles)
    return Promise.all(
        styles.map(s => instance.value?.getContentRaw(s.id ?? "")));
}

</script>
