import Transformer from "./Transformer"
import Word from "./Word"
export type MaybeHTMLElement = HTMLElement|null;
import {isReading} from "./isReading"
import { readAloud } from "./readAloud";
import { BookmarkController } from "../Bookmarks";
import { notifier } from "./readAloud";
import { EV } from "./EV";
import { className } from "./constants";

notifier.on(EV.end , () => {

    if (isReading.value)
        ChapterWalker.instance.next();
})
export class ChapterWalker {
    static instance:ChapterWalker;
    walker:TreeWalker;
    constructor(root:HTMLElement) {
        this.walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
        
        ChapterWalker.instance = this;
    }

    next() {
        let n:HTMLElement|null = null

        //IMPORTANT: The span tags made by Transformer should never be included.
        Transformer.revert() 
        do {
            n = this.walker.nextNode() as HTMLElement // ASSURED since treewalker filters only Elements
        } while(n?.parentElement?.classList.contains(className.para)||false)

        if (n == null) {
            /* When walker has been exhausted:
            TODO depending on mode:
            lazy: Try loading next chapter
            all: Notify user
            */
            return;
        }
        this.beforeSpeak(n.textContent || "");
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
        BookmarkController.saveProgress(this.walker.currentNode)
        Transformer.revert()
    }
    toggle() {
        isReading.value ? this.stop():this.start();
    }

    identify(e:MouseEvent) {
        const l = e.target as HTMLElement;

        if (l.isSameNode(this.walker.currentNode) || l.tagName == "IMG")
            return false;

        this.stop()

        // TODO: Ensure that target is a descendant of walker.root
        this.walker.currentNode = l;
    }
}