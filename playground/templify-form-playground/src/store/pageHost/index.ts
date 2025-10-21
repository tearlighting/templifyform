import { defineStore } from "pinia"
import { ref } from "vue"
import pinia from "../store"

export const usePageHostStore = defineStore("pageHost", () => {
  const hostRef = ref<HTMLDivElement>()

  return {
    hostRef,
  }
})

export const usePageHostStoreHook = () => usePageHostStore(pinia)
