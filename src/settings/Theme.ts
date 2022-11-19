import { useLocalStorage, useMediaQuery } from "@vueuse/core"
import { watch } from "vue"

export const prefersDark = useMediaQuery("prefers-color-scheme: dark")
export const dark = useLocalStorage("theme", prefersDark)

watch(prefersDark, t => {
    dark.value = t
})