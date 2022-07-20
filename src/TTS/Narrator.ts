import {isReading} from "./isReading"
import { readAloud } from "./readAloud";
import { BookmarkController } from "../Bookmarks";
import { EV } from "./EV";
import { EventEmitter } from "events";
import { EnhancedEpub } from "../modules/EnhancedEpub";
import { LoadMethod, loadMethod } from "../Library/Load";
export type MaybeHTMLElement = HTMLElement|null;
import { walker } from "vuk-walker/src/walker";
import Transformer from "vuk-walker/src/Transformer";
import { scrollIfUnseen } from "./scrollIfUnseen";
import { className } from "./constants";

export function follow() {
    scrollIfUnseen(walker.currentNode.parentElement)
}

export const transformer = new Transformer(className.para);
class Narrator extends EventEmitter {
    constructor() {
        super()
        this.on(EV.end , this.onEnd)
        this.on(EV.exhausted, this.onExhausted)
    }

    private async onEnd() {
        if (isReading.value) {
            await this.next();
        }
        else {
            BookmarkController.saveProgress(walker.currentNode.parentElement)
        }
    }

    /* Based on loadMethod:
    lazy: Try loading next chapter or do case `all`
    all: Notify user
    */
    private async onExhausted() {
        if (loadMethod.value == LoadMethod.lazy) {
            try {
                await EnhancedEpub.instance?.next();
                this.next(true)
            } catch(e){};

            return;
        }

        isReading.value = false;
    }

    private async next(exhausted=false) {
        //IMPORTANT: The span tags made by Transformer should never be included.
        transformer.revert()
        const n = walker.nextNode();

        if (n == null || exhausted == false) {
            
            this.emit(EV.exhausted)
 
            return;
        }

        this.beforeSpeak(n);
    }

    private beforeSpeak(n:Node, txt?:string) {
        txt = txt ?? n.textContent ?? "";

        if (txt.length == 0) {
            this.next();
            return;
        }
        
        const charIndex = transformer.transform(n, 0);
        if (charIndex) {
            txt = txt.slice(charIndex);
        }
        readAloud(txt)
        follow()
    }
    start() {
        this.beforeSpeak(walker.currentNode)
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
        isReading.value ? this.stop():this.start();
    }

    identify(e:MouseEvent) {
        const l = e.target as HTMLElement;
        this.override(l);
    }

    override(l:HTMLElement) {
        let n = l.firstChild;
        if (!n || n.isSameNode(walker.currentNode))
        return false;
        
        console.log("Override: " , n);
        transformer.revert()
        this.stop()

        // TODO: Ensure target descends from walker.root
        walker.currentNode = n;
    }
}

//Singleton
export const narrator = new Narrator();