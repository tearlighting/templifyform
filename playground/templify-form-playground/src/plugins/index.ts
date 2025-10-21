import type { IAddPlugin } from "../../types/plugin"
import { addElementPlus } from "./element-plus"
import { add18n } from "./i18n"
import { addPinia } from "./pinia"
import { addTailwindCSS } from "./tailwindcss"
import { addVueRouter } from "./vue-router"

export const addPlugins: IAddPlugin = (app) => {
  addTailwindCSS(app)
  add18n(app)
  addPinia(app)
  addVueRouter(app)
  addElementPlus(app)
}
