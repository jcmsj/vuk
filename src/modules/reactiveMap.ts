import {reactive} from "vue"
import {EnhancedMap} from "@jcsj/arraymap";
export default function reactiveMap<K, V>(obj = {}) {
    return reactive(
        Object.assign({
            items: new EnhancedMap<K, V>(),
            at(n:number):[K?, V?] {
                return this.items.at(n)
            },

            pairOf(key:K) {
                return this.items.pairOf(key)
            },
            isEmpty() {
                return this.items.size <= 0
            }
        }, obj)
    )
}