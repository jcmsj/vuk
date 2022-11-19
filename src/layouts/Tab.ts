import { ref, watch } from "vue";

export const tab = ref<string | undefined>("")

export const isSelected = ref(false);

export function toggleSelect(tabName: string) {
    console.log({ tabName });
    if (tabName === tab.value) {
        isSelected.value = true
    } else {
        tab.value = tabName
    }
}

export function hide() {
    tab.value = undefined
}

watch(tab, it => {
    if (typeof it === "string") {
        isSelected.value = false
    }
})

watch(isSelected, n => {
    if (n === true) {
        hide()
        isSelected.value = false
    }
})
