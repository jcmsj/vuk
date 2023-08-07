import Router from "src/router";

export function toHome(...args:any[]) {
    Router.replace({name:"/", ...args})
}
export function toggleSelect(tabName: string) {
  const name = Router.currentRoute.value.name?.toString()
    if (name?.localeCompare(tabName) === 0) {
      toHome()
    } else {
      Router.replace({name:tabName})
    }
}
