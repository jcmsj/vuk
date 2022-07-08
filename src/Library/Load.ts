import {ref} from "vue"

export enum LoadMethod {
    all = "all",
    lazy = "lazy (experimental)"
}

export const loadMethod = ref(LoadMethod.all);