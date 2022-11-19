import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path:"/",
    component: () => import("src/layouts/Layout.vue"),
    children:[
      {
        path:"",
        component: () => import("src/Book/Live.vue"),
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("src/pages/404.vue"),
  },
];

export default routes;
