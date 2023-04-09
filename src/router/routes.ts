import { Platform } from "quasar";
import { RouteRecordRaw } from "vue-router";
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("src/layouts/Layout.vue"),
    children: [
      {
        path: "browse",
        component: () => {
          if (Platform.is.electron) {
            return import("src/Library/ElectronExplorer.vue")
          }
          return import("src/Library/Explorer.vue")
        }
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
