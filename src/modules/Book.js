import {reactive} from "vue"
import Epub from "@jcsj/epub";

export const Book = reactive({
    singleton : null,
    contentID : null,
    content : "",

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

    async updateContent(id) {
        this.setContent(
            await this.singleton.getContent(id)
        )

        this.setContentID(id)
    },

    setContent(text) {
        if (!text) {
            text =  `
            Press: <br>
            C - Show TOC <br>
            F - Show File explorer`
        }

        this.content = text
    },

    setContentID(id) {
        this.contentID = id;
    },

    getContentID() {
        return this.contentID
    }
})