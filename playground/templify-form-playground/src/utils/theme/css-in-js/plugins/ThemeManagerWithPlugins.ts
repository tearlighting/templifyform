import type { ThemeItem } from "theme"

import { ThemeManager } from "../core/ThemeManager"

export class ThemeManagerWithPlugins<ThemeName extends string = never> extends ThemeManager<ThemeName> {
  private _plugins: IPlugin<typeof ThemeManagerWithPlugins<ThemeName>>[] = []
  usePlugin(plugin: IPlugin<typeof ThemeManagerWithPlugins<ThemeName>>): this {
    this._plugins.push(plugin)
    plugin.mount(this)
    return this
  }
  destroyPlugin(): boolean {
    if (this._plugins.length === 0) return true
    try {
      this._plugins.forEach((plugin) => plugin.unmount(this as any))
      return true
    } catch (e) {
      return false
    } finally {
      this._plugins = []
    }
  }
  register<T extends string>(item: ThemeItem<T>) {
    super.register(item)
    return this as ThemeManagerWithPlugins<ThemeName | T>
  }
}

export const createThemeManagerWithPlugins = (rootEl: HTMLElement = document.documentElement) => new ThemeManagerWithPlugins(rootEl)
