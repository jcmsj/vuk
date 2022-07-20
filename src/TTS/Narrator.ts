import Transformer from "./Transformer"
import Word from "./Word"
import {isReading} from "./isReading"
import { readAloud } from "./readAloud";
import { BookmarkController } from "../Bookmarks";
import { EV } from "./EV";
import { EventEmitter } from "events";
import { EnhancedEpub } from "../modules/EnhancedEpub";
import { LoadMethod, loadMethod } from "../Library/Load";
export type MaybeHTMLElement = HTMLElement|null;
import { walker, follow } from "./walker";

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
            BookmarkController.saveProgress(walker.currentNode)
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
        Transformer.revert() 
        const n = walker.nextNode();

        if (n == null && exhausted == false) {
            
            this.emit(EV.exhausted)
 
            return;
        }

        this.beforeSpeak(n as HTMLElement);
    }

    private beforeSpeak(elem:HTMLElement, txt?:string) {
        txt = txt ?? elem.innerText ?? "";

        if (txt.length == 0) {
            this.next();
            return;
        }
     
        const charIndex = Transformer.transform(elem, Word.index);
        if (charIndex) {
            txt = txt.slice(charIndex);
        } else {
            //The narrator is going to speak new text. 
            Word.reset(elem);
        }
        readAloud(txt)
        follow()
    }
    start() {
        this.beforeSpeak(walker.currentNode as HTMLElement)
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
        if (l.isSameNode(walker.currentNode))
        return false;
        
        console.log("Override: " , l);
        Transformer.revert()
        this.stop()

        // TODO: Ensure target descends from walker.root
        walker.currentNode = l;
    }
}

//Singleton
export const narrator = new Narrator();