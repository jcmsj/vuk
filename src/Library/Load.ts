import {ref} from "vue"

export enum LoadMethod {
    all = "all",
    lazy = "lazy"
}

export const loadMethod = ref(LoadMethod.lazy);