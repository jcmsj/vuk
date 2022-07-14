import Epub from "@jcsj/epub";
import simplifyHTMLTree from "./simplifyHTMLTree";
import { drop, repaint } from "../Live";
import { Item } from "@jcsj/epub/traits";

class BoundaryError extends RangeError {
    name = "BoundaryError"
    constructor(where:string) {
        super(`Unable to load book element beyond the ${where}.`)
    }
}
export class EnhancedEpub extends Epub {
    index = 0;
    id = ""; //The currently shown flow item called from between
    static instance:EnhancedEpub|null = null

    constructor(file:File) {
        super(file, simplifyHTMLTree)
        EnhancedEpub.instance = this;
    }

    async between(IDorIndex:string|number) {
        let index:number;
        if (typeof IDorIndex == "string") {
            
            let [i] = this.flow.pairOf(IDorIndex);
            if (i == undefined) {
                return false;
            }
            index = i;
        }
        else {
            index = IDorIndex
        }
        
        if (index < 0 || index >= this.flow.size)
            return false;

        let prev:Item;
        const [key] = this.flow.at(index)
        const toBeLoaded = []

        const append = async(id:string) =>
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
    async getWrapped(id:string) {
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
            throw new BoundaryError("start or end")
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