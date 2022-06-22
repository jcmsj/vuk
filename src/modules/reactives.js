import {reactive} from "vue"

export function reactiveMap(obj = {}) {
    return reactive(
        Object.assign({
            items: new Map(),
            at(n) {
                let i = 0
                for (const pair of this.items) {
                    if (n == i++) {
                        return pair
                    }
                }
        
                return null
            }
        }, obj)
    )
}

export const 
    TOC = reactiveMap(),
    Flow = reactiveMap()
;