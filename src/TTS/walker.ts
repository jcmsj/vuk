import Transformer from "./Transformer"
import Word from "./Word"
import {isReading} from "./isReading"
import { readAloud } from "./readAloud";
import { BookmarkController } from "../Bookmarks";
import { EV } from "./EV";
import { className } from "./constants";
import { EventEmitter } from "events";
import { scrollIfUnseen } from "./scrollIfUnseen";
export type MaybeHTMLElement = HTMLElement|null;

const t = (c:HTMLElement, name:string) =>
c.classList.contains(name);

function skip(n:Node) {
    //chapter
    let result = t(n as HTMLElement, className.chapter) ? NodeFilter.FILTER_SKIP:NodeFilter.FILTER_ACCEPT;

    //Prevents repeat of text
    if (n.parentElement?.childElementCount == 1)
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
        this.on(EV.end , () => {
            if (isReading.value) {
                ChapterWalker.instance.next();
                scrollIfUnseen(this.walker.currentNode as HTMLElement)
            }
            else {
                BookmarkController.saveProgress(ChapterWalker.instance.walker.currentNode)
            }
        })
    }

    private next() {
        //IMPORTANT: The span tags made by Transformer should never be included.
        Transformer.revert() 
        const n = this.walker.nextNode() as HTMLElement;

        if (n == null) {
            this.emit(EV.exhausted)
            /* When walker has been exhausted:
            TODO depending on mode:
            lazy: Try loading next chapter
            all: Notify user
            */
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