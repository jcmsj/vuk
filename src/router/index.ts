import { savedPositions } from 'src/router/storeScrollBehavior';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouterOptions,
} from 'vue-router';

import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

const createHistory = process.env.SERVER
  ? createMemoryHistory
  : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);


export const baseOptions: RouterOptions = {
  routes:[],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition ?? savedPositions[to.fullPath] ?? { top: 0 }
  },
  // Leave this as is and make changes in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  history: createHistory(process.env.VUE_ROUTER_BASE),
}

export const Router = createRouter({
  ...baseOptions,
  routes,
});

export default Router;