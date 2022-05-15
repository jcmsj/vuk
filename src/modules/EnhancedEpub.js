import Epub from "@jcsj/epub";
import {Flow} from "./Flow.js";
import {TOC} from "./TOC.js";

class EnhancedEpub extends Epub {
    /**
     * 
     * @param {File} file 
     */
    constructor(file) {
        super(file)
        this.flowIndex = 1;
        this.done = false;
        TOC.items = [];
        Flow.items = [];

        this.on("parsed-spine", async(e) => {
            for (const item of this.flow) {    
                Flow.items
                .push(
                    await this.getContent(item.id)
                )            
                
            }

            console.log("DONE");
            this.done = true;
        })

        this.on("parsed-toc", e => {
            TOC.items.push(...this.toc);
        })
    }
}

export default EnhancedEpub;