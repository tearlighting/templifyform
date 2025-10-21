import type { ILanguageManager } from "language"
import type { App } from "vue"
import { createI18n, type I18n } from "vue-i18n"

export class LanguageManager implements ILanguageManager {
  private _i18nIns: I18n<{}, {}, {}, string, false> | null = null
  install(app: App): void {
    if (!this._i18nIns) console.error("LanguageManager is not initialized")
    app.use(this._i18nIns!)
  }

  init<TMessage extends Record<string, any>>(messages: TMessage, defaultLocale?: keyof TMessage) {
    const firstLocale = defaultLocale ?? Object.keys(messages)[0]
    this._i18nIns = createI18n({
      legacy: false,
      locale: firstLocale as string,
      messages: messages,
    })
    return this as any as LanguageManager
  }

  setLocale(locale: string): void {
    this._i18nIns!.global.locale.value = locale
  }
  t(path: string): string {
    if (!this._i18nIns) throw new Error("i18n not initialized")
    const result = this._i18nIns.global.t(path)
    return result === path ? this._i18nIns.global.t(`${path}._`) : result
  }
}

export const createLanguageManager = () => new LanguageManager()
