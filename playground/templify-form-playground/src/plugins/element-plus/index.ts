import type { IAddPlugin } from "plugin"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
export const addElementPlus: IAddPlugin = (app) => {
  app.use(ElementPlus)
}
