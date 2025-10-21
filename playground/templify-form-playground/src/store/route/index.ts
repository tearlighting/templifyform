import { defineStore } from "pinia"
import { reactive, ref } from "vue"
import pinia from "../store"
import { routes } from "@/router"
import { transformRoute } from "./tools"

import { getMeta } from "@/utils"
import type { AppRoute, StrictMeta } from "router"

export const useRouteStore = defineStore("route", () => {
  const displayRoutes = ref<AppRoute[]>([])
  const currentRoute = reactive({
    name: null as string | null,
    meta: null as StrictMeta | null,
  })

  function setCurrent(name: string) {
    currentRoute.name = name
    currentRoute.meta = getMeta(routes, currentRoute.name)!
  }
  async function generateDisplayRoutes() {
    displayRoutes.value = await transformRoute.run(routes)
  }

  return {
    displayRoutes,
    setCurrent,
    generateDisplayRoutes,
    currentRoute,
  }
})

export const useRouteStoreHook = () => useRouteStore(pinia)
