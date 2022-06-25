/**
 * Adds more array-like functionalities to the Map data structure.
 */
export class EnhancedMap extends Map{
    /**
     * @param {Map} map 
     */
    constructor(map = null) {
        super()
        if (map instanceof Map) {
            for (const pair of map) {
                this.set(...pair)
            }
        }
    }

    /**
     * Similar to Array.indexOf
     * @param {String} key 
     * @param {Functiion} cb 
     * @returns An index-value pair
     */
    pairOf(key) {
        let i = 0;
        for (const [k, val] of this) {
            if (key == k) {
                return [i, val];
            }
    
            i++
        }
    
        return null
    }

    /**
     * 
     * @param {Number} n 
     * @param {Function} cb 
     * @returns The key-value pair at index n
     */
    at(n) {
        let i = 0
        for (const pair of this) {
            if (n == i++) {
                return pair
            }
        }
        return null
    }
}

/**
 * @param {Number} i 
 * @param {Map} map 
 * @param {Function} cb 
 */
export function pairOf(key, map) {
    let i = -1;
    for (const [k, val] of map) {
        if (key == k)
            return [i, val];
        i++
    }
    return null
}

/**
 * @param {Number} n 
 * @param {Map} map 
 * @param {Function} cb 
 * @returns The key-val pair
 */
export function at(n, map) {
    let i = 0
    for (const pair of map) {
        if (n == i++)
            return pair;
    }
    
    return null
}