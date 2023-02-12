import { useLocalStorage } from "@vueuse/core";

export const reveal = useLocalStorage("tts-panel-state", true);
export default reveal;