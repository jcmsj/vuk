import Epub from "@jcsj/epub";
import simplifyHTMLTree from "./simplifyHTMLTree";
import { drop, repaint } from "../Live/";
export default class EnhancedEpub extends Epub {
    index = 0;
    id = ""; //The currently shown flow item called from between
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
        const [key] = this.flow.at(index)
        const toBeLoaded = []

        const append = async(id) =>
            toBeLoaded.push(
                await this.getWrapped(id)
            );
        
        for (const [id, item] of this.flow) {

            if (toBeLoaded.length > 0) {
                await append(id)
                break;
            }

            if (key == id) {
                if (prev)
                    await append(prev.id);

                await append(id)
            }

            prev = item
        }
        
        this.index = index;
        this.id = key;
        repaint(toBeLoaded)
        return true;
    }

    async loadAll() {
        const toBeLoaded = []
        for (const [k] of this.flow) {
            toBeLoaded.push(await this.getWrapped(k))
        }

        repaint(toBeLoaded);
    }
    async getWrapped(id) {
        return {
            id,
            html: await this.getContent(id)
        }
    }
    /**
     * Advancing by two since 3 chapters are loaded  at a time.
     */
    async next() {
        await this.drop(2)
    }

    async drop(offset) {
        
        const o = offset / 2
        const pair = this.flow.at(this.index + offset)
        if (pair == null)
            throw RangeError("Trying to load beyond the start or end of book");
        this.index += o
        drop({
            pos: o,
            ... await this.getWrapped(pair[0])
        })
    }

    /**
     * Read comment in next()
     */
    async previous() {
        await this.drop(-2)
    }
}

