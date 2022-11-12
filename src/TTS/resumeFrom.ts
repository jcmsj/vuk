import { getSelectionText } from "../lib/helpers";

export function resumeFrom(l:HTMLElement) {
    const sel = getSelectionText()
    let offset = 0;
    let index = 0
    if (sel.length) {
        index = l.innerText.indexOf(sel)

        if (index) {
            for (let i = index; i > 0; i--) {
                if (l.innerText.charAt(i) == ' ') 
                    offset++;
            }
        }
    }

    return {char:index, word:offset};
}