import type { IRouteGuarder } from "router"

export const turn2PageGuard: IRouteGuarder = ([_, __, next]) => {
  next()
}
