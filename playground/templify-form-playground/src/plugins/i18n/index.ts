import { languageManager } from "@/store"
import type { IAddPlugin } from "plugin"

export const add18n: IAddPlugin = (app) => {
  app.use(languageManager.managerIns)
}
