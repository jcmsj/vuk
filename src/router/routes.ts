import { Platform } from "quasar";
import ElectronExplorer from "src/Library/ElectronExplorer.vue";
import Explorer from "src/Library/Explorer.vue";
import TauriExplorer from "src/Library/TauriExplorer.vue";
import Layout from "src/layouts/Layout.vue";
import { RouteRecordRaw } from "vue-router";

function determineExplorer() {
  if (Platform.is.electron) {
    return ElectronExplorer;
  } 

  if (window.__TAURI_INVOKE__ instanceof Function)  {
    return TauriExplorer;
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
        name: "browse",
        component: determineExplorer(),
      },
      {
        path: "config",
        name: "config",
        component: () => import("src/settings/SettingsPage.vue")
      },
      {
        path: "toc",
        name: "toc",
        component: () => import("src/TOC/TOC.vue")
      },
      {
        path: "bookmarks",
        name: "bookmarks",
        component: () => import("src/Bookmarks/Bookmarks.vue")
      },
      // Always leave this as last one,
      // but you can also remove it
      {
        path: ":catchAll(.*)*",
        name:"404",
        component: () => import("src/pages/404.vue"),
      },
    ]
  },
];

export default routes;
