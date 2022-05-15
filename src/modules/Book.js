import {reactive} from "vue"
import EnhancedEpub from "./EnhancedEpub.js";

export const Book = reactive({
    singleton : null,

    /**
     * 
     * @param {EnhancedEpub} epub 
     */
    setSingleton(epub) {
        this.singleton = epub;
    },

    /**
     * 
     * @returns {EnhancedEpub}
     */
    getSingleton() {
        return this.singleton
    },

    /* async updateContent(id = null) {
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
    }, */

    clickTOC(e) {
        return
        const id = e.target.dataset.id;

        console.log("TOC ID: ", id);

        this.updateContent(id, true)
    },

    getContentID() {
        return this.contentID
    }
})