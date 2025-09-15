import pinia from "@/store"
import type { App } from "vue"

export const addPinia = (app: App) => {
  app.use(pinia)
}
