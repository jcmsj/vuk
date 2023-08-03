import { Platform } from "quasar";
import CapacitorExplorer from "src/Library/CapacitorExplorer.vue";
import ElectronExplorer from "src/Library/ElectronExplorer.vue";
import Explorer from "src/Library/Explorer.vue";
import Taurist from "src/Library/Taurist.vue";
import Layout from "src/layouts/Layout.vue";
import { RouteRecordRaw } from "vue-router";

function determineExplorer() {
  if (Platform.is.electron) {
    return ElectronExplorer;
  } 

  if (Platform.is.capacitor) {
    return CapacitorExplorer;
  }

  if (window.__TAURI_INVOKE__ instanceof Function)  {
    return Taurist;
  }
  return Explorer;
}

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "browse",
        component: determineExplorer(),
      },
      {
        path: "config",
        component: () => import("src/settings/SettingsPage.vue")
      },
      {
        path: "toc",
        component: () => import("src/TOC/TOC.vue")
      },
      {
        path: "bookmarks",
        component: () => import("src/Bookmarks/Bookmarks.vue")
      },
      // Always leave this as last one,
      // but you can also remove it
      {
        path: ":catchAll(.*)*",
        component: () => import("src/pages/404.vue"),
      },
    ]
  },
];

export default routes;
