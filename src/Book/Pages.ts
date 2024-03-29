import { LoadedChapter } from "src/lib/EnhancedEpub";
import { ref } from "vue";

/**
 * Don't use a shallow ref since it'll break lazy mode
 */
export const pages = ref<LoadedChapter[]>([])
export const view = ref<HTMLDivElement>();

