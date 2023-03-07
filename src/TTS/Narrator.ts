import { isReading } from "./isReading"
import { readAloud } from "./readAloud";
import { BookmarkController } from "../Bookmarks";
import { EV } from "./EV";
import { instance } from "../lib/EnhancedEpub";
import { LoadMethod, loadMethod } from "../Library/Load";
import { walker, Transformer } from "v-walker";
import { scrollIfUnseen } from "./scrollIfUnseen";
import { className } from "./constants";
import { getReadingProgress } from "../lib/useMainElem";
import { useEventBus, UseEventBusReturn } from "@vueuse/core";

interface EventMap extends Partial<Record<EV, Function | undefined>> { };
export function follow() {
    scrollIfUnseen(transformer.elem)
}
export const transformer = new Transformer(className.para);

export class Narrator {
    bus: UseEventBusReturn<string, string>;
    target?: HTMLElement;
    constructor() {
        this.bus = useEventBus("narrator")
        const eventMap: EventMap = {
            "0": this.onExhausted.bind(this),
            "2": this.onEnd.bind(this),
        };
        this.bus.on(ev => eventMap[ev as keyof EventMap]?.())
    }

    emit(ev: EV) {
        this.bus.emit(ev)
    }
    private async onEnd() {
        if (isReading.value) {
            this.next();
            return;
        }

        BookmarkController.saveProgress(transformer.elem?.parentElement, getReadingProgress())
    }

    /* Based on loadMethod:
    lazy: Try loading next chapter or do case `all`
    all: Notify user
    */
    private async onExhausted() {
        if (loadMethod.value == LoadMethod.lazy) {
            try {
                await instance?.next();
                this.next(true)
            } catch (e) {
                isReading.value = false;
            }
        }
    }

    private next(exhausted=false) {
        //IMPORTANT: The span tags made by Transformer should never be included.
        transformer.revert()
        const n = walker.nextNode();
        if (n) {
            this.beforeSpeak(n);
        } else if (!exhausted){
            this.emit(EV.exhausted)
        }
    }

    /**
     * `txt` or the node's text
     */
    private beforeSpeak(n: Node, txt?: string) {
        txt ??= n.textContent ?? "";

        if (txt.length == 0) {
            this.next();
            return;
        }
        const charIndex = transformer.transform(n, transformer.elem?.index || 0);
        if (charIndex) {
            txt = txt.slice(charIndex);
        }
        readAloud(txt)
        follow()
    }
    start(at?: string) {
        this.beforeSpeak(walker.currentNode, at)
    }

    stop() {
        if (!speechSynthesis.speaking) {
            return;
        }

        speechSynthesis.cancel()
        isReading.value = speechSynthesis.speaking
        this.emit(EV.end)
    }
    toggle() {
        isReading.value ? this.stop() : this.start();
    }

    identify(e: MouseEvent) {
        const l = e.target as HTMLElement;
        this.override(l);
    }

    override(l: HTMLElement) {
        const n = l.firstChild;
        if (!n || walker.currentNode?.isSameNode(n))
            return false;

        console.log("Override: ", l);
        transformer.revert()
        this.stop()

        // TODO: Ensure target descends from walker.root
        walker.currentNode = n;
        this.target = l;
    }
}

//Singleton
export const narrator = new Narrator();