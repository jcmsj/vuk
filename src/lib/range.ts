// Sequence generator function 
// (commonly referred to as "range", e.g. Clojure, PHP etc)
export function range(start:number, exclusiveStop:number, step:number=1) {
    return Array.from({ length: (exclusiveStop - start) / step + 1}, (_, i) => start + (i * step))
} 