import type { TTheme } from "theme"

import type { ThemeManager } from "../core"

export class InitialThemeWithStorge implements IPlugin<typeof ThemeManager<TTheme>> {
  constructor(private _themeGetter: () => TTheme) {}
  mount(instance: ThemeManager<TTheme>): void {
    instance.setTheme(this._themeGetter())
  }
  unmount(): void {}
}

export const createInitialThemeWithStorge = (themeGetter: () => TTheme) => new InitialThemeWithStorge(themeGetter)
