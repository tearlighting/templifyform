import { defineStore } from "pinia"
import { reactive, ref } from "vue"
import { getDevice, Settings, getDeviceType } from "./tools"
import pinia from "../store"

export const useAppStore = defineStore("app", () => {
  const device = ref(getDevice())
  const settings = reactive(new Settings())
  const deviceType = ref(getDeviceType(device.value))
  function updateDevice() {
    device.value = getDevice()
    deviceType.value = getDeviceType(device.value)
  }

  window.addEventListener("resize", updateDevice)

  return {
    device,
    updateDevice,
    settings,
    deviceType,
  }
})

export const useAppStoreHook = () => useAppStore(pinia)
