import { languageManager } from "@/store"
import type { App } from "vue"

export const add18n = (app: App) => {
  app.use(languageManager.managerIns)
}
