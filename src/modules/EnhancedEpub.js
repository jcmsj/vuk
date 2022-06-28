import Epub from "@jcsj/epub";
import simplifyHTMLTree from "./simplifyHTMLTree";
import { at } from "./Maps";
import { drop, repaint } from "../components/View";
class EnhancedEpub extends Epub {
    index = 0;
    static instance = null
    /**
     * 
     * @param {File} file 
     */
    constructor(file) {
        super(file, simplifyHTMLTree)
        EnhancedEpub.instance = this;
    }

    async between(IDorIndex) {
        let index = IDorIndex
        if (typeof IDorIndex == "string")
            [index] = this.flow.pairOf(IDorIndex);

        if (index < 0 || index >= this.flow.size)
            return false;

        let prev;
        const [key] = at(index, this.flow);
        const toBeLoaded = []
        for (const [id, item] of this.flow) {

            if (toBeLoaded.length > 0) {
                toBeLoaded.push({
                    id,
                    html: await this.getContent(id),
                })
                break;
            }

            if (key == id) {
                if (prev)
                    toBeLoaded.push({
                        id:prev.id,
                        html: await this.getContent(prev.id),
                    })

                toBeLoaded.push({
                    id,
                    html: await this.getContent(id),
                })
            }

            prev = item
        }
        
        this.index = index;
        repaint(toBeLoaded)
        return true;
    }

    async next() {
        this.drop(2)
    }

    async drop(offset) {
        
        const o = offset / 2
        const pair = this.flow.at(this.index + offset);
        if (pair == null)
            throw RangeError("Trying to load beyond the start or end of book");

        const [id] = pair;
        this.index += o
        drop({
            pos:o,
            id,
            html: await this.getContent(id)
        })
    }
    async previous() {
        this.drop(-2)
    }
}

export default EnhancedEpub