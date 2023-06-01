import {ref} from "vue"
import getScrollPercentage from "./getScrollPercentage";
export const mainElem = ref<HTMLElement>()

export function getReadingProgress() {
    return getScrollPercentage(mainElem.value)
}
export default mainElem;