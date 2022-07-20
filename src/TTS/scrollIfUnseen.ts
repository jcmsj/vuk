import { isElementInViewport, refocus } from "../modules/helpers";

export function scrollIfUnseen(l:HTMLElement|null) {
    if (l && !isElementInViewport(l))
        refocus(l);
}