import Router from "src/router";

export function toHome(...args:any[]) {
    Router.replace({path:"../", ...args})
}

export function toggleSelect(e: MouseEvent | KeyboardEvent, tabName: string) {
    if (Router.currentRoute.value.name == tabName) {
      toHome()
    } else if (e instanceof KeyboardEvent) {
      Router.replace(tabName)
    }
}
