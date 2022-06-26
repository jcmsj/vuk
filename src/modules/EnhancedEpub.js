import Epub from "@jcsj/epub";
import simplifyHTMLTree from "./simplifyHTMLTree";
import { Flow } from "./reactives";
import { at } from "./Maps";
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

    async display(id) {
        return await this.displayMutiple([this.flow.get(id)])
    }

    async displayAt(index) {
        if (index < 0)
            index = 0;

        index = Math.min(Math.max(index, 0), this.flow.size)

        const [_, v] = at(index, this.flow)

        if (v) {
            this.index = index
            return this.displayMutiple([v]);
        }

        throw new ReferenceError(`Flow item at index ${index} is undefined. This should never happen.`)
    }

    /**
     * 
     * @param {Array<object>} toBeLoaded
     */
    async displayMutiple(toBeLoaded) {
        Flow.items.clear()
        let skipped = 0;
        for (const item of toBeLoaded) {
            if (item) {
                Flow.items
                    .set(item.id, await this.getContent(item.id))
            } else
                skipped++
        }

        console.log("Loaded:", toBeLoaded);
    }


    async between(IDorIndex) {
        let index = IDorIndex
        if (IDorIndex instanceof String) {
            [index, _] = this.flow.pairOf(IDorIndex)
        }

        if (index < 0 || index >= this.flow.size)
            return false;

        let prev;
        const [id, view] = at(index, this.flow);

        const toBeLoaded = []
        for (const [key, item] of this.flow) {

            if (toBeLoaded.length > 0) {
                toBeLoaded.push(item)
                break;
            }

            if (key == id) {
                if (prev)
                    toBeLoaded.push(prev)
                toBeLoaded.push(item)
            }

            prev = item
        }
        
        this.index = index;
        this.displayMutiple(toBeLoaded);
        return true;
    }

    next() {
        this.between(this.index+1)
    }

    previous() {
        this.between(this.index-1)
    }
}

export default EnhancedEpub