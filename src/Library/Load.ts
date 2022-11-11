import { useLocalStorage } from "@vueuse/core";

export enum LoadMethod {
    all = "all",
    lazy = "lazy"
}

export const loadMethod = useLocalStorage("load-method",LoadMethod.lazy);