import simplifyHTMLTree from "./simplifyHTMLTree";
import { render, reassign, repaint, LoadPosition } from "../Book";
import { range } from "./range"
import { CachedEpub } from "@jcsj/epub";
class BoundaryError extends RangeError {
    name = "BoundaryError"
    constructor(where: string) {
        super(`Unable to load book element beyond the ${where}.`)
    }
}

export interface LoadedChapter {
    id: string,
    html: string
}
export class EnhancedEpub extends CachedEpub {
    index = 0;
    id = ""; //The currently shown flow item called from between
    static instance: EnhancedEpub | null = null
    range = 1;
    constructor(file: File) {
        super(file, simplifyHTMLTree)
        EnhancedEpub.instance = this;
    }

    private slice(start: number, exclusiveEnd: number) {
        return range(start, exclusiveEnd)
            .map(i => this.flow.at(i)[0])
            .filter((v): v is string => typeof v == "string");
    }
    async between({ id, index }: { id?: string, index?: number }) {
        if (id == undefined && index == undefined) {
            throw new TypeError("Must provide either 'id' or 'index'.");
        } else if (index == undefined && id != undefined) {
            id = id.replace("\\", ""); //Patch id may have "\"
            index = this.flow.pairOf(id)[0] ?? -1;
        } else if (id == undefined && index != undefined) {
            [id] = this.flow.at(index);
        }

        if (
            id == undefined
            || index == undefined
            || index < 0
            || index >= this.flow.size
        )
            return false;

        const leftMost = index - this.range
        const rightMost = index + this.range
        let before: string[] = this.slice(Math.max(0, leftMost), index - 1);
        //center == id
        let after: string[] = this.slice(index + 1, Math.min(rightMost, this.flow.size))

        const toBeLoaded = await Promise.all([
            ...before,
            id,
            ...after
        ].map(this.retrieve, this));

        //Reassign if toBeloaded resolves
        this.index = index;
        this.id = id;

        await repaint(toBeLoaded)
        reassign()
        return true;
    }

    async loadAll() {
        await repaint(
            await Promise.all([...this.flow.keys()]
                .map(this.retrieve, this)
            ));

        reassign()
    }
    private async retrieve(id: string): Promise<LoadedChapter> {
        return {
            id,
            html: await this.getContent(id)
        }
    }

    async next() {
        try {
            if (this.index! + 2 < this.flow.size!) {
                await this.render(LoadPosition.after)
            }
        } catch(e) {
            console.log(`No more chapters after index ${this.index}`, e);
        }
    }

    private async render(pos: LoadPosition) {
        /**
         * Advancing by two since 3 chapters are loaded  at a time.
         */
        const offset = pos * 2
        const pair = this.flow.at(this.index + offset)
        if (pair[0] == undefined)
            throw new BoundaryError("start or end")

        this.index += pos
        render({
            pos,
            ... await this.retrieve(pair[0])
        })
    }

    async previous() {
        try {
            if (this.index > 0) {
                await this.render(LoadPosition.before)
            }
        } catch(e) {
            console.log(`No chapters before index ${this.index}`, e);
        }
    }
}