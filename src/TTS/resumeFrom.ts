import { getSelectionText } from "../lib/helpers";

export function resumeFrom(l: HTMLElement) {
    const sel = getSelectionText()
    const index = l.innerText.indexOf(sel);
    let offset = 0;
    for (let i = index; i > 0; i--) {
        if (l.innerText.charAt(i) == ' ')
            offset++;
    }
    return { char: index, word: offset };
}