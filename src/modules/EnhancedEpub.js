import Epub from "@jcsj/epub";
/* 
2 stacks
1. Read
2. Unread
Pointer = currentpage
*/
class EnhancedEpub extends Epub {

    /**
     * 
     * @param {File} file 
     */
    constructor(file) {
        super(file)
        this.on("loaded", async(e) => {
            for (const item of this.flow) {                
                this.cache.setText(item.id,
                        await this.getContent(item.id)
                );
            }

        })
    }
}

export default EnhancedEpub;