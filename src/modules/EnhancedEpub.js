import Epub from "@jcsj/epub";
import simplifyHTMLTree from "./simplifyHTMLTree";
import { Flow } from "./reactives";
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
        if (IDorIndex instanceof String)
            [index, _] = this.flow.pairOf(IDorIndex);

        if (index < 0 || index >= this.flow.size)
            return false;

        let prev;
        const [key, _] = at(index, this.flow);
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
        offset = Math.min(Math.max(0, offset), this.flow.size - 1)
        const o = offset / 2
        this.index += o
        const [id, _] = this.flow.at(this.index + offset);
        drop({
            pos:o,
            id,
            html: await this.getContent(id)
        })
    }
    previous() {
        this.drop(-2)
    }
}

export default EnhancedEpub