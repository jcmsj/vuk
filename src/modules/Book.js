import {reactive} from "vue"
import Epub from "@jcsj/epub";
//import Epub from "../modules/test-epub"

export const Book = reactive({
    singleton : null,
    contentID : null,
    content : "",

    defaultContent: `
        Press: <br>
        C - Show TOC <br>
        F - Show File explorer
    `,

    /**
     * 
     * @param {Epub} epub 
     */
    setSingleton(epub) {
        this.singleton = epub;
    },

    /**
     * 
     * @returns {Epub}
     */
    getSingleton() {
        return this.singleton
    },

    async updateContent(id = null) {
        if (!(this.singleton || id)) {
            this.setContent()
            return
        }
        
        this.setContent(
            await this.singleton.getContent(id)
        )

        this.setContentID(id)
    },

    setContent(text = "") {
        if (text) {
            this.content = text
        } else {
            this.content = this.defaultContent
        }
    },

    setContentID(id) {
        this.contentID = id;
    },

    getContentID() {
        return this.contentID
    }
})