import type { RouteLocationNormalizedGeneric } from "vue-router"
import { bfs } from "../tree"
export * from "./guard"
import type { AppRoute } from "router"

interface INamedRoute {
  name: string
  children?: INamedRoute[]
}

export function findRoute<T extends INamedRoute>(routes: T[] | T, name: string) {
  let result: T | null = null
  name &&
    bfs(routes, (item) => {
      if (item.name === name) {
        result = item
        return {
          needBreak: true,
        }
      }
    })
  return result
}
export function findMenuCurrent(to: RouteLocationNormalizedGeneric, displayRoutes: AppRoute[]): string | null {
  // 拿到路由的匹配链（父→子）
  const matched = to.matched
  // 倒序遍历，优先匹配子，找不到再回退到父
  for (let i = matched.length - 1; i >= 0; i--) {
    const name = matched[i].name as string
    if (existsInDisplayRoutes(displayRoutes, name)) {
      return name
    }
  }

  return null
}

// 判断某个 name 是否存在于 displayRoutes 树
function existsInDisplayRoutes(routes: AppRoute[], name: string): boolean {
  let res = false
  bfs(routes, (route) => {
    if (route.name === name) {
      res = true
      return {
        needBreak: true,
      }
    }
  })
  return res
}
export function getMeta(routes: AppRoute[], currentRouteName: string) {
  const route = findRoute(routes as any, currentRouteName!) as unknown as AppRoute
  return route?.meta
}

export function createRoutes<T extends AppRoute[]>(routes: T): AppRoute[] {
  return routes
}
