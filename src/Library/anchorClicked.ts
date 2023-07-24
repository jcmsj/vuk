import { log } from "src/settings/DevMode";
import { LoadMethod, loadMethod } from "./Load";
import { instance } from "src/lib/EnhancedEpub";

export async function anchorClicked(e: MouseEvent, id?: string) {
  if (e.target instanceof HTMLAnchorElement) {
    id ??= e.target.hash.split("#")[1];

    // Stop navigation when `id` is nullable
    // Note: this doesnt prevent external links since this just checks for an id.


    // Confirm navigation for external link
    if (e.target.hostname !== window.location.hostname) {
      if (window.confirm("Visit external site?")) {
        window.open(e.target.href, "_blank")
      } else {
        e.preventDefault()
      }
      return;
    }
    log(`%c[Router] ${e.target.href}`, "color: lightgreen;", id,);
  }

  if (loadMethod.value === LoadMethod.all) {
    document.getElementById(id!)?.scrollIntoView({ behavior: "smooth" })
  }  else {
    instance.value?.between({ id })
  }

}
