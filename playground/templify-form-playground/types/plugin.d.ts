import { App } from "vue"

export interface IAddPlugin {
  (app: App<Element>): void
}
