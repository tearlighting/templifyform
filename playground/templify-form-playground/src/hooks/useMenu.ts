import { EDeviceType } from "@/constants"
import { menuManager, useAppStoreHook, useMenuStoreHook } from "@/store"
import { storeToRefs } from "pinia"

export const useMenu = () => {
  const { deviceType } = storeToRefs(useAppStoreHook())
  const { syncMenuInfo } = useMenuStoreHook()

  function toggleMenu() {
    if (deviceType.value === EDeviceType.MOBILE) menuManager.toggleHidden()
    else menuManager.toggleCollapse()
    syncMenuInfo() // 同步菜单信息
  }

  return {
    toggleMenu,
  }
}
