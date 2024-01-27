import { isReading } from "./isReading"
import { readAloud } from "./readAloud";
import { EV } from "./EV";
import { instance } from "../lib/EnhancedEpub";
import { LoadMethod, loadMethod } from "../Library/Load";
import Transformer from "v-walker";
import { scrollIfUnseen } from "./scrollIfUnseen";
import { className } from "./constants";
import { getReadingProgress } from "../lib/useMainElem";
import { useEventBus, UseEventBusReturn } from "@vueuse/core";
import { saveProgress } from "src/Bookmarks/useBook";
import { walker } from "src/Book/Target";

export function follow() {
    scrollIfUnseen(transformer.elem)
}
export const transformer = new Transformer(className.para);

export class Narrator {
    bus: UseEventBusReturn<EV, void>;
    constructor() {
        this.bus = useEventBus<EV, void>("narrator")
        this.bus.on(ev => {
            if (ev == EV.end) {
                this.onEnd()
            } else if (ev == EV.exhausted) {
                this.onExhausted()
            }
        })
    }

    emit(ev: EV) {
        this.bus.emit(ev)
    }
    private async onEnd() {
        if (isReading.value) {
            this.next();
            return;
        }
        saveProgress(transformer.elem?.parentElement, getReadingProgress())
    }

    /* Based on loadMethod:
    lazy: Try loading next chapter or do case `all`
    all: Notify user
    */
    private async onExhausted() {
        if (loadMethod.value == LoadMethod.lazy) {
            try {
                await instance.value?.next();
                this.next()
                this.emit(EV.exhausted)
            } catch (e) {
                isReading.value = false;
            }
        }
    }

    private next() {
        //IMPORTANT: The span tags made by Transformer should never be included.
        transformer.revert()
        const n = walker.value!.nextNode();
        if (n) {
            this.beforeSpeak(n);
        }
    }

    /**
     * `txt` or the node's text
     */
    private beforeSpeak(n: Node) {
        let txt = n.textContent ?? "";

        if (txt.length == 0) {
            this.next();
            return;
        }
        const charIndex = transformer.transform(n, transformer.elem?.index || 0);
        txt = txt.slice(charIndex);
        readAloud(txt)
        follow()
    }
    start() {
        this.beforeSpeak(walker.value!.currentNode)
    }

    stop() {
        speechSynthesis.cancel()
        isReading.value = false
        this.emit(EV.end)
    }
    toggle() {
        isReading.value ? this.stop() : this.start();
    }
}

//Singleton
export const narrator = new Narrator();
