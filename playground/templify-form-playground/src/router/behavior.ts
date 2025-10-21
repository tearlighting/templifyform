import type { NavigationGuardWithThis } from "vue-router"

import type { IAllStoreProps } from "@/init"
import { createAuthGuard, createFlowMiddleware, isLoginGuard, turn2PageGuard } from "@/utils"

import router from "./"
import { createAfterEachChangeRecactiveDataMiddleware, createBeforeEachChangeRecactiveDataMiddleware } from "./changeReactiveData"

/**
 * 设置路由守卫
 * @param param0
 */
export function setupRouteGuard<T extends IAllStoreProps>(stores: T) {
  const beforeEachChangeRecactiveDataMiddleware = createBeforeEachChangeRecactiveDataMiddleware(stores)
  const routerBeforeEachMiddleware = createFlowMiddleware<Parameters<NavigationGuardWithThis<any>>>()
    .use(isLoginGuard)
    .use(createAuthGuard(stores.userStore, { path: "/" }))
    .use((ctx, next) => {
      beforeEachChangeRecactiveDataMiddleware.run(ctx)
      next()
    })
    .use(turn2PageGuard)

  router.beforeEach(async (...args) => await routerBeforeEachMiddleware.run(args))

  const afterEachChangeRecactiveDataMiddleware = createAfterEachChangeRecactiveDataMiddleware(stores)
  router.afterEach((...args) => {
    afterEachChangeRecactiveDataMiddleware.run(args)
  })
}
