import { EnhancedEpub } from "../lib/EnhancedEpub"
import { LoadMethod, loadMethod } from "./Load";

export async function anchorClicked(e: MouseEvent, id?:string) {
  if (e.target instanceof HTMLAnchorElement) {
    id = id ?? e.target.hash.split("#")[1];
  }

  if (id) {
    if (loadMethod.value == LoadMethod.all) {
      document.getElementById(id)?.scrollIntoView()
    } else {
      EnhancedEpub.instance?.between({id})
    }
  }
}