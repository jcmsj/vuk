import { useLocalStorage } from "@vueuse/core";

export const DevMode = useLocalStorage("devmode", false);
export default DevMode;

export function log(...args:Parameters<typeof console.log>) {
    if (DevMode.value) {
        console.log(...args)
    }
}
