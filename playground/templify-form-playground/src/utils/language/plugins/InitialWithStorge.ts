import type { LanguageCoreWithPlugin } from "./LanguageCoreWithPlugins"

export class InitialLanguageWithStorge implements IPlugin<typeof LanguageCoreWithPlugin<string>> {
  constructor(private _localeGetter: () => string) {}
  mount(instance: LanguageCoreWithPlugin<string>): void {
    instance.setLocale(this._localeGetter())
  }
  unmount(): void {}
}

export const createInitialLanguageWithStorge = (localeGetter: () => string) => new InitialLanguageWithStorge(localeGetter)
