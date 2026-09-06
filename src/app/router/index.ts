import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import publicRoutes from './public/index'

const routes: Array<RouteRecordRaw> = [...publicRoutes]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
