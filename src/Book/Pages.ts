import { LoadedChapter } from "src/lib/EnhancedEpub";
import { ref } from "vue";

export const pages = ref<LoadedChapter[]>([])
export const view = ref<HTMLDivElement>();
export const prev = ref<HTMLDivElement>();
export const next = ref<HTMLDivElement>();