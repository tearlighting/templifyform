import { usePageHostStore } from "@/store"
import screenfull from "screenfull"

export const useFullScreen = () => {
  const hostRef = usePageHostStore()
  function fullScreen() {
    if (screenfull.isEnabled) {
      screenfull.request(hostRef.hostRef)
    } else {
      console.log("不支持全屏")
    }
  }
  function exitFullScreen() {
    screenfull.isEnabled && screenfull.exit()
  }
  return {
    fullScreen,
    exitFullScreen,
  }
}
