import simplifyHTMLTree from "./simplifyHTMLTree";
import { render as renderView, LoadPosition } from "../Book";
import { range } from "./range"
import { BoundaryError } from "./BoundaryError";
import { MemoizedEpubAndSanitized } from "@jcsj/epub"
import { CleanEpub } from "@jcsj/epub/lib/sanitize";
import { shallowRef } from "vue";
import { log } from "src/settings/DevMode";
import { pages } from "src/Book/Pages";
export interface LoadedChapter {
    id: string,
    html: string
}

export interface EnhancedEpub extends CleanEpub {
    index: number;
    id: string; //The currently shown flow item called from between
    range: number;
    slice(start: number, exclusiveEnd: number): string[];
    retrieve(id: string): Promise<LoadedChapter>;
    between(data: {
        id?: string;
        index?: number;
    }): Promise<boolean>;
    loadAll(): Promise<void>;
    next(): Promise<void>;
    render(pos: LoadPosition): Promise<void>;
    previous(): Promise<void>;
}
export let instance = shallowRef<EnhancedEpub>();
export async function Enhanced(a: Parameters<typeof MemoizedEpubAndSanitized>["0"]): Promise<EnhancedEpub> {
    a.chapterTransformer = simplifyHTMLTree;
    a.fallbackImage = ""
    // Try to load stuff from entries
    a.missingMediaHandler = async (it) => {
        const l = await old.parser.reader.read(it.src.replace("../", ""), "image/*");
        if (l && l.data instanceof Blob) {
            log("Found: ", it.src)
            const d = URL.createObjectURL(l.data as Blob)
            it.img.setAttribute(it.key, d)
            return d
        }
        log("Still missing: ", it.src);

        return undefined
    }
    const old = await MemoizedEpubAndSanitized(a);
    log(old.parser.reader.entries);

    instance.value = {
        ...old,
        index: 0,
        id: "", //The currently shown flow item called from between
        range: 1,
        slice(start: number, exclusiveEnd: number) {
            return range(start, exclusiveEnd)
                .map(i => this.parts.flow.at(i)[0])
                .filter((v): v is string => typeof v == "string");
        },

        async retrieve(id: string): Promise<LoadedChapter> {
            return {
                id,
                html: await this.getContent(id)
            }
        },

        async between({ id, index }) {
            if (id == undefined && index == undefined) {
                throw new TypeError("Must provide either 'id' or 'index'.");
            } else if (index == undefined && id != undefined) {
                id = id.replace("\\", ""); //Patch: id may have "\"
                index = this.parts.flow.pairOf(id)[0] ?? -1;
            } else if (id == undefined && index != undefined) {
                [id] = this.parts.flow.at(index);
            }

            if (
                id == undefined
                || index == undefined
                || index < 0
                || index >= this.parts.flow.size
            )
                return false;

            const leftMost = Math.max(0, index - this.range)
            const rightMost = Math.min(index + this.range, this.parts.flow.size)
            const before: string[] = this.slice(leftMost, index - 1);
            //center == id
            const after: string[] = this.slice(index + 1, rightMost);

            const toBeLoaded = await Promise.all([
                ...before,
                id,
                ...after
            ].map(this.retrieve, this));

            //Reassign if toBeloaded resolves
            this.index = index;
            this.id = id;
            pages.value = toBeLoaded;
            return true;
        },

        async loadAll() {
            pages.value = await Promise
            .all([...this.parts.flow.keys()]
                    .map(this.retrieve, this)
                );
        },

        async next() {
            if (this.index! + 2 < this.parts.flow.size!) {
                await this.render(LoadPosition.after)
            } else {
                throw Error(`No more chapters after index ${this.index}`)
            }
        },

        async render(pos: LoadPosition) {
            /**
             * Advancing by two since 3 chapters are loaded  at a time.
             */
            const offset = pos * 2
            const id = this.parts.flow.at(this.index + offset)[0];
            if (id === undefined)
                throw new BoundaryError("start or end")

            this.index += pos
            renderView({
                pos,
                ... (await this.retrieve(id))
            })
        },

        async previous() {
            if (this.index > 0) {
                try {
                    await this.render(LoadPosition.before)
                } catch (e) {
                    console.log(`No chapters before index ${this.index}`, e);
                }
            }
        }
    }
    return instance.value;
}
