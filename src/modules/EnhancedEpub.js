import Epub from "@jcsj/epub";
import {Flow} from "./Flow";
import {TOC} from "./TOC";
import simplifyHTMLTree from "./simplifyHTMLTree";
class EnhancedEpub extends Epub {
    /**
     * 
     * @param {File} file 
     */
    constructor(file) {
        super(file, simplifyHTMLTree)
        this.flowIndex = 1;
        this.done = false;
        Flow.items = new Map();
        this.on("parsed-flow", async(e) => {
            for (const [key, item] of this.flow) {    
                Flow.items.set(
                    key, 
                    await this.getContent(item.id)
                )
            }

            console.log("DONE");
            this.done = true;
        })

        this.on("parsed-toc", e => {
            TOC.items = this.toc;
        })
    }
}

export default EnhancedEpub;