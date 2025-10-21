import router from "@/router"
import type { IAddPlugin } from "plugin"

export const addVueRouter: IAddPlugin = (app) => {
  app.use(router)
}
