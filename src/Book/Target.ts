import { createTextTreeWalker } from "src/walker";
import { shallowReactive } from "vue";

export let walker:TreeWalker;

export function setWalker(l:HTMLElement) {
    walker = createTextTreeWalker(l);
}

interface Target {
    /** Represents the last selected element of the user that belongs to the EPUB. */
    element: HTMLElement | undefined;
    identify(e: MouseEvent): void;
    override(l: HTMLElement): boolean;
}

export const target = shallowReactive<Target>({
    element:undefined,
    identify(e:MouseEvent) {
        if (e.target instanceof HTMLElement) {
            this.override(e.target);
        } else {
            console.log(e.AT_TARGET, " is not an element!")
        }
    },
    override(l: HTMLElement) {
        const n = l.firstChild;
        if (!n ||walker.currentNode.isSameNode(n)) {
            return false;
        }
    
        // TODO: Ensure target descends from walker.root
        walker.currentNode = n;
        target.element = l;
        return true;
    }
});