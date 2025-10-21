import { createTransformMiddleWare } from "@/utils"
import { EPemission } from "@/constants"
import { useUserStoreHook } from "../user"
import { storeToRefs } from "pinia"
import type { AppRoute } from "router"

function filterHiddenRoutes(routes: AppRoute[]): AppRoute[] {
  const res = []
  for (let route of routes) {
    if (!route.meta?.hidden) {
      const currentRoute = { ...route }
      if (route.children?.length) {
        currentRoute.children = filterHiddenRoutes(route.children)
      }
      res.push(currentRoute)
    } else {
      if (route.children?.length) {
        res.push(...filterHiddenRoutes(route.children))
      }
    }
  }
  return res
}

function filterAccessRoutes(routes: AppRoute[], pemission: EPemission): AppRoute[] {
  const res = []
  for (let route of routes) {
    if (route.meta?.roles?.includes(pemission)) {
      const currentRoute = { ...route }
      if (route.children?.length) {
        currentRoute.children = filterAccessRoutes(route.children, pemission)
      }
      res.push(currentRoute)
    }
  }
  return res
}

function filterAccessRoutesWithUserInfo(routes: AppRoute[]) {
  const { userInfo } = storeToRefs(useUserStoreHook())
  const pemission = userInfo.value.role
  return filterAccessRoutes(routes, pemission)
}

export const transformRoute = createTransformMiddleWare<AppRoute[]>().use(filterHiddenRoutes).use(filterAccessRoutesWithUserInfo)
