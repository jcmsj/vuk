import { className } from "src/TTS/constants";
import { ref } from "vue";

export const epubStyle = ref<string|undefined>()
export const rawStyle = ref<string|undefined>();
export const prefix = `#__live > .${className.chapter} `;
