import { useLocalStorage } from "@vueuse/core";

export const DevMode = useLocalStorage("devmode", false);
export default DevMode;