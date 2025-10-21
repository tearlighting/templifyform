import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"

import { EPemission } from "@/constants"
import { EIcons } from "@/constants/icons"
import DefaultLayout from "@/layout/DefaultLayout.vue"
import { createRoutes } from "@/utils"

/**
 * 设计的就是具名路由,想要keepAlive的话,组件里面必须同步设置name,否则无法生效
 */

export const routes = createRoutes([
  {
    path: "/",
    redirect: {
      name: "DefaultFormVue",
    },
    name: "Home",
    meta: {
      hidden: true,
      noTag: true,
      roles: [EPemission.visitor],
    },
  },

  {
    path: "/dashboard",
    component: DefaultLayout,
    meta: {
      noTag: true,
      hidden: true,
      roles: [EPemission.visitor],
    },
    children: [
      {
        path: "",
        name: "DefaultFormVue",
        component: () => import("@/views/VueFormView/index.vue"),
        meta: {
          keepAlive: true,
          titleKey: "router.defaultFormVue",
          roles: [EPemission.visitor],
          icon: EIcons.Dashboard,
        },
      },
    ],
  },
])

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[],
})

export default router
