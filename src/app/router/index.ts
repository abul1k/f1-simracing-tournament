import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import publicRoutes from './public/index'

const routes: Array<RouteRecordRaw> = [...publicRoutes]

const router = createRouter({
  history: createWebHistory(),
  routes,

  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 80 }

    return { top: 0 }
  },
})

export default router
