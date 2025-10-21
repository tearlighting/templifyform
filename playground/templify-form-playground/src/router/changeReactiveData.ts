import type { IRouteAfter, IRouteGuarder } from "router"
import type { NavigationGuardWithThis, NavigationHookAfter } from "vue-router"

import type { IAllStoreProps } from "@/init"
import { createFlowMiddleware, findMenuCurrent } from "@/utils"

export function createBeforeEachChangeRecactiveDataMiddleware<T extends IAllStoreProps>({ routeStore }: T) {
  const changeCurrentRoute: IRouteGuarder = ([to], next) => {
    const menuName = findMenuCurrent(to, routeStore.displayRoutes)
    if (menuName) {
      routeStore.setCurrent(menuName)
    } else {
      console.error("don't find menu ", to, routeStore.displayRoutes)
    }
    next()
  }

  //   const changeCurrentTagView: IRouteGuarder = ([to], next) => {
  //     const name = to.name as string
  //     name && tagViewStore.setCurrent(name)
  //     next()
  //   }

  const changeRecactiveDataMiddleware = createFlowMiddleware<Parameters<NavigationGuardWithThis<any>>>().use(changeCurrentRoute)
  //   .use(changeCurrentTagView)
  return changeRecactiveDataMiddleware
}

export function createAfterEachChangeRecactiveDataMiddleware<T extends IAllStoreProps>({ tagViewStore }: T) {
  const changeCurrentTagView: IRouteAfter = ([to], next) => {
    const name = to.name as string
    name && tagViewStore.setCurrent(name)
    next()
  }
  const changeRecactiveDataMiddleware = createFlowMiddleware<Parameters<NavigationHookAfter>>().use(changeCurrentTagView)
  return changeRecactiveDataMiddleware
}
