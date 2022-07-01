import {reactive} from "vue"
import {EnhancedMap} from "./Maps";
export function reactiveMap(obj = {}) {
    return reactive(
        Object.assign({
            items: new EnhancedMap(),
            at(n) {
                return this.items.at(n)
            },

            pairOf(key) {
                return this.items.pairOf(key)
            },
            isEmpty() {
                return this.items.size <= 0
            }
        }, obj)
    )
}