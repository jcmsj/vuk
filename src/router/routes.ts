import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("src/layouts/Layout.vue"),
    children: [
      {
        path:"",
        component:() => import("src/Library/Explorer.vue")
      },
      {
        path:"library",
        component:()=>import("src/Library/Recent.vue")
      },
      {
        path:"read",
        component: () => import("src/Book/Book.vue")
      },
      {
        path:"config",
        component:() => import("src/settings/SettingsPage.vue")
      }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("src/pages/404.vue"),
  },
];

export default routes;
