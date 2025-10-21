import { NestedKeys } from "language"
import { NavigationGuardWithThis, NavigationHookAfter, RouteRecordRaw } from "vue-router"

import type { EIcons } from "@/constants/icons"
import type { en } from "@/constants/locale"
import { EPemission } from "@/store/pemission"

export type BaseMeta = {
  keepAlive?: boolean
  roles: EPemission[]
  icon?: EIcons
  noTag?: boolean
  hidden?: boolean
  externalLink?: string
}

type TI18nSetting = { title: string; titleKey?: never } | { title?: never; titleKey: NestedKeys<typeof en> }

export type StrictMeta =
  // 1️⃣ hidden=false | undefined, noTag=false | undefined → 需要标题
  | (BaseMeta & { hidden?: false; noTag?: false } & TI18nSetting)
  // 2️⃣ hidden=false | undefined, noTag=true → 需要标题
  | (BaseMeta & { hidden?: false; noTag: true } & TI18nSetting)
  // 3️⃣ hidden=true, noTag=false | undefined → 需要标题
  | (BaseMeta & { hidden: true; noTag?: false } & TI18nSetting)
  // 4️⃣ hidden=true, noTag=true → 不需要标题
  | (BaseMeta & { hidden: true; noTag: true })

export type AppRoute = Omit<RouteRecordRaw, "meta" | "children"> & {
  /**
   * 路由元信息
   */
  meta: StrictMeta
  children?: AppRoute[]
}

export interface IRouteGuarder {
  (routerPayload: Parameters<NavigationGuardWithThis<any>>, next: () => Promise<void>): void | Promise<void>
}

export interface IRouteAfter {
  (routerPayload: Parameters<NavigationHookAfter>, next: () => Promise<void>): void | Promise<void>
}
