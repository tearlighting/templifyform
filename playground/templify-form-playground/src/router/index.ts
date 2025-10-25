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
      name: "VueForm",
    },
    name: "Home",
    meta: {
      hidden: true,
      noTag: true,
      roles: [EPemission.visitor, EPemission.admin, EPemission.user],
    },
  },

  {
    path: "/vueform",
    component: DefaultLayout,
    meta: {
      noTag: true,
      hidden: true,
      roles: [EPemission.visitor, EPemission.admin, EPemission.user],
    },
    children: [
      {
        path: "",
        name: "VueForm",
        component: () => import("@/views/VueFormView/index.vue"),
        meta: {
          keepAlive: true,
          titleKey: "router.vueForm",
          roles: [EPemission.visitor, EPemission.admin, EPemission.user],
          icon: EIcons.Vue,
        },
      },
    ],
  },
  {
    path: "/reactform",
    component: DefaultLayout,
    meta: {
      noTag: true,
      hidden: true,
      roles: [EPemission.visitor, EPemission.admin, EPemission.user],
    },
    children: [
      {
        path: "",
        name: "ReactForm",
        component: () => import("@/views/ReactFormView/index.vue"),
        meta: {
          keepAlive: true,
          titleKey: "router.reactForm",
          roles: [EPemission.visitor, EPemission.admin, EPemission.user],
          icon: EIcons.React,
        },
      },
    ],
  },
  {
    path: "/reactstoreform",
    component: DefaultLayout,
    meta: {
      noTag: true,
      hidden: true,
      roles: [EPemission.visitor, EPemission.admin, EPemission.user],
    },
    children: [
      {
        path: "",
        name: "ReactStoreForm",
        component: () => import("@/views/ReactStoreFormView/index.vue"),
        meta: {
          keepAlive: true,
          titleKey: "router.reactStoreForm",
          roles: [EPemission.visitor, EPemission.admin, EPemission.user],
          icon: EIcons.ReactTest,
        },
      },
    ],
  },
  {
    path: "/reactstorelargeform",
    component: DefaultLayout,
    meta: {
      noTag: true,
      hidden: true,
      roles: [EPemission.visitor, EPemission.admin, EPemission.user],
    },
    children: [
      {
        path: "",
        name: "ReactStoreLargeForm",
        component: () => import("@/views/ReactStoreLageFormView/index.vue"),
        meta: {
          keepAlive: true,
          titleKey: "router.reactStoreLargeForm",
          roles: [EPemission.visitor, EPemission.admin, EPemission.user],
          icon: EIcons.Form,
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
