import pinia from "@/store"
import type { IAddPlugin } from "plugin"

export const addPinia: IAddPlugin = (app) => {
  app.use(pinia)
}
