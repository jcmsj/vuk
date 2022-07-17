import { isElementInViewport, refocus } from "../modules/helpers";

export function scrollIfUnseen(l:HTMLElement) {
    if (!isElementInViewport(l))
        refocus(l);
}