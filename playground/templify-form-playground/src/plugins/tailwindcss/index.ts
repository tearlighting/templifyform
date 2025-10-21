import type { IAddPlugin } from "../../../types/plugin"

export const addTailwindCSS: IAddPlugin = () => {
  import("./index.css")
}
