import type { App } from "vue"
import { add18n } from "./i18n"
import { addPinia } from "./pinia"
import { addElementPlus } from "./element-plus"

export const addPlugins = (app: App) => {
  add18n(app)
  addPinia(app)
  addElementPlus(app)
}
