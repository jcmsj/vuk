import { createRouter } from "vue-router";
import { baseOptions } from ".";
import baseRoutes from "./routes";
const routes = [...baseRoutes];

routes[0]!.children![0].component = () => {
  return import("src/Library/ElectronExplorer.vue")
}

export const router = createRouter({
    ...baseOptions,
    routes,
})

export default router;