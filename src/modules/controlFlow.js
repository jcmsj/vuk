import nef from "./nef"
import { useIntersectionObserver } from "@vueuse/core";
import EnhancedEpub from "./EnhancedEpub"
export const ev = {
    head:0,
    tail:1
}

export const next = nef()
export const prev = nef()

/**
 * @param {Number} maybeEV 
 */
/* function wrap(maybeEV) {
    return maybeEV % lim;
}
function add(src = ev.tail) {
    const self = EnhancedEpub.instance;
    let i = self.index - 1;
    if (i < 0)
        return

    EnhancedEpub.instance.between(i);

    //TODO: Load next elem
    const self = EnhancedEpub.instance
    const i = self.index + (src ? 1:-1)
    self.between(i);
    /* const [k, item] = self.flow.at(i);
    //null means end|start of book
    if (item == null)
        return;

    switch(src) {
        case ev.head:
            rQueue.unshift(item)
        break;
        case ev.tail:
            rQueue.push(item)
        break;
    }

    self.index = i;
} */

/* export function drop(src = ev.head) {
    src = wrap(src)

    switch(src) {
        case ev.head:
        rQueue.shift()
        break;
        case ev.tail:
        rQueue.pop()
        break;
    }

    add(src ? ev.tail:ev.head)
} */

const margin = 0.
/**
 * @param {IntersectionObserverEntry} entry 
 */
function within(entry) {
    return entry.intersectionRatio > margin
}

export async function mayAdd() {
    const { stop } = useIntersectionObserver(
        next.value,
        ([entry], observer) => {
            if (entry.isIntersecting) {
                console.log(">");
                EnhancedEpub.instance.next();
            }
        },
    )
}

export async function mayDrop() {
    const { stop } = useIntersectionObserver(
        prev.value,
        ([entry], observer) => {
            if (entry.isIntersecting) {
                console.log("<");
                EnhancedEpub.instance.previous();
            }
        },
    )
}