
import {LoadedChapter} from "../lib/EnhancedEpub";
import { view, pages} from "./Pages";
import { useLocalStorage } from "@vueuse/core";


export function repaint(paintables:LoadedChapter[] = []) {
    pages.value = paintables;
}

export interface Page extends LoadedChapter {
    pos:LoadPosition
}

export enum LoadPosition {
    before=-1,
    after=1
}

const ShiftCount = useLocalStorage("shift-count",2)

export async function render(p:Page ) {
    const _pages = pages.value;
    
    switch (p.pos) {
        case LoadPosition.before:
            if (_pages.length > ShiftCount.value) {
                _pages.pop()
            }
            view.value?.firstElementChild?.scrollIntoView({ block: "nearest", behavior: "smooth" })
            _pages.unshift(p)
        break;
        case LoadPosition.after:
            if (_pages.length > ShiftCount.value) {
                _pages.shift()
            }
            _pages.push(p)
        break;
        default:
            console.log("Invalid pos:", p.pos);
    }
}
