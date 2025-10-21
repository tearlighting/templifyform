import { watch } from "vue"
import { useRouteStoreHook, useTagViewStoreHook, themeManager, useUserStoreHook, useAppStoreHook, useMenuStoreHook, menuManager } from "./store"
import { setupRouteGuard } from "./router/behavior"
import { EDeviceType } from "./constants"

export interface IAllStoreProps {
  userStore: ReturnType<typeof useUserStoreHook>
  routeStore: ReturnType<typeof useRouteStoreHook>
  tagViewStore: ReturnType<typeof useTagViewStoreHook>
  themeStore: typeof themeManager
  appStore: ReturnType<typeof useAppStoreHook>
  menuStore: ReturnType<typeof useMenuStoreHook>
}
/**
 * 注入主题
 * @param param0
 */
function setupTheme<T extends IAllStoreProps>({ themeStore }: T) {
  themeStore.setTheme(themeStore.current)
}
/**
 * 监听用户角色变化，设置显示的路由
 * @param param0
 */
function setDisplayRoutes<T extends IAllStoreProps>({ userStore, routeStore }: T) {
  watch(
    () => userStore.userInfo.role,
    () => {
      routeStore.generateDisplayRoutes()
    },
    { immediate: true }
  )
}

function changeMenuType<T extends IAllStoreProps>({ appStore, menuStore }: T) {
  watch(
    () => appStore.deviceType,
    () => {
      if (appStore.deviceType === EDeviceType.MOBILE) {
        menuManager.hide()
      } else {
        menuManager.show()
      }
      menuStore.syncMenuInfo()
    },
    {
      immediate: true,
    }
  )
}

function initApp() {
  const stores: IAllStoreProps = {
    userStore: useUserStoreHook(),
    routeStore: useRouteStoreHook(),
    tagViewStore: useTagViewStoreHook(),
    themeStore: themeManager,
    appStore: useAppStoreHook(),
    menuStore: useMenuStoreHook(),
  }
  setDisplayRoutes(stores)
  setupTheme(stores)
  setupRouteGuard(stores)
  changeMenuType(stores)
}
initApp()
