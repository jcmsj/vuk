import Transformer from "./Transformer"
import Word from "./Word"
import {isReading} from "./isReading"
import { readAloud } from "./readAloud";
import { BookmarkController } from "../Bookmarks";
import { EV } from "./EV";
import { className } from "./constants";
import { EventEmitter } from "events";
import { scrollIfUnseen } from "./scrollIfUnseen";
import { EnhancedEpub } from "../modules/EnhancedEpub";
import { LoadMethod, loadMethod } from "../Library/Load";
export type MaybeHTMLElement = HTMLElement|null;

function skipClassName(c:HTMLElement, name:string) {
    return c.classList.contains(name);
}

function skipTagName(l:HTMLElement) {
    return ["old", ].includes(l.tagName);
}

//Prevents repeat of text
function skipSoleChild(n:Node) {
    return n.parentElement?.childElementCount == 1
}
function skip(n:Node) {
    const l = n as HTMLElement
    let result = NodeFilter.FILTER_ACCEPT;
    if (skipClassName(l, className.chapter)  
    || skipTagName(l) 
    || skipSoleChild(n))
        result = NodeFilter.FILTER_SKIP;
    return  result;
}
export class ChapterWalker extends EventEmitter {
    static instance:ChapterWalker;
    private walker:TreeWalker;
    constructor(root:HTMLElement) {
        super()
        this.walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT,skip);
        ChapterWalker.instance = this;
        this.walker.nextNode() //Skip the root
        this.on(EV.end , this.onEnd)
        this.on(EV.exhausted, this.onExhausted)
    }

    private async onEnd() {
        if (isReading.value) {
            await ChapterWalker.instance.next();
        }
        else {
            BookmarkController.saveProgress(ChapterWalker.instance.walker.currentNode)
        }
    }

    /* Based on loadMethod:
    lazy: Try loading next chapter or do case `all`
    all: Notify user
    */
    private async onExhausted() {
        if (loadMethod.value == LoadMethod.lazy) {
            try {
                await EnhancedEpub.instance?.next()
                this.next()
            } catch(e){};

            return;
        }

        isReading.value = false;
    }

    private async scrollIfUnseen() {
        scrollIfUnseen(this.walker.currentNode as HTMLElement)
    }
    private async next() {
        //IMPORTANT: The span tags made by Transformer should never be included.
        Transformer.revert() 
        const n = this.walker.nextNode() as HTMLElement;

        if (n == null) {
            this.emit(EV.exhausted)
 
            return;
        }

        this.beforeSpeak((n instanceof HTMLImageElement ? n.alt:n.textContent) || "");
    }

    private beforeSpeak(txt:string) {
        if (txt.length == 0) {
            this.next();
            return;
        }
     
        const charIndex = Transformer.transform(this.walker.currentNode as HTMLElement, Word.index);
        if (charIndex) {
            txt = txt.slice(charIndex);
        } else {
            //The narrator is going to speak new text. 
            Word.reset(this.walker.currentNode as HTMLElement);
        }
        readAloud(txt)
        this.scrollIfUnseen()
    }
    start() {
        this.beforeSpeak(this.walker.currentNode.textContent || "")
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
        console.log("Override: " , l);
        
        if (l.isSameNode(this.walker.currentNode))
            return false;

        Transformer.revert()
        this.stop()

        // TODO: Ensure target descends from walker.root
        this.walker.currentNode = l;
    }
}