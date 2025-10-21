import { NestedKeys } from "language"

import type { en } from "@/constants/locale"

export type ThemeVars = Record<string, string>

export interface IThemeManager<ThemeName extends string> {
  current: ThemeName
  getTheme(): ThemeVars
  setTheme(name: ThemeName): void
  createLocal(overrides: Partial<ThemeVars>): ThemeVars
  exportTheme(): string
  importTheme(vars: ThemeVars): void
}
export type Palette = {
  primary: string
  secondary: string
  accent: string
  success: string
  warning: string
  danger: string
  bg: string
  text: string
  surface: string // 浮层 / 卡片背景
  border: string // 边框
  muted: string // 次要文字
}

export type ThemeLabel =
  | {
      labelKey?: never
      label: string
    }
  | {
      labelKey: NestedKeys<typeof en>
      label?: never
    }

export type ThemeItem<TKey extends string> = {
  value: TKey
  palette: Palette
} & ThemeLabel

export type TTheme = typeof themeManager.current
