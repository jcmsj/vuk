import {reactive} from "vue"

export function reactiveMap(obj = {}) {
    return reactive(
        Object.assign({
            items: new Map()
        }, obj)
    )
}

export const 
    TOC = reactiveMap(),
    Flow = reactiveMap()
;