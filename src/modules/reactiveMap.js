import {reactive} from "vue"

export default function reactiveMap(obj = {}) {
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