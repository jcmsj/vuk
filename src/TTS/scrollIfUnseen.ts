import { isElementInViewport, refocus } from "../lib/helpers";

export function scrollIfUnseen(l:HTMLElement|null) {
    if (l && !isElementInViewport(l))
        refocus(l);
}