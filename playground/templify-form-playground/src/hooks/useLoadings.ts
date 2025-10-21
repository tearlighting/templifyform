import { ElLoading, type LoadingOptions } from "element-plus"

export const useLoadings = () => {
  let loadingIns: { close: () => void } | null = null

  const showLoading = (payload: LoadingOptions = {}) => {
    loadingIns = ElLoading.service({
      lock: true,
      ...payload,
    })
  }
  const hideLoading = () => {
    if (loadingIns) {
      loadingIns.close()
      loadingIns = null
    }
  }
  return {
    showLoading,
    hideLoading,
  }
}
