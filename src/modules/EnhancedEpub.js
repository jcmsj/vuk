import Epub from "@jcsj/epub";
import {Flow, TOC} from "./reactives";
import simplifyHTMLTree from "./simplifyHTMLTree";
export class EnhancedEpub extends Epub {
    /**
     * 
     * @param {File} file 
     */
    constructor(file) {
        super(file, simplifyHTMLTree)
        this.done = false;
        Flow.items = new Map(); //Reset
        this.on("parsed-flow", async() => {
            for (const [key, item] of this.flow) {    
                Flow.items.set(
                    key, 
                    await this.getContent(item.id)
                )
            }

            this.emit("loaded-chapters")
            console.log("DONE");
            this.done = true;
        })

        this.on("parsed-toc", e => {
            TOC.items = this.toc;
        })
    }
}