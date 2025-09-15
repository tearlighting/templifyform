import type { ILanguageItem } from "language"

export class LanguageCore<TKey extends string = never, TMessage extends Record<string, any> = {}> {
  private _languageMessages: Record<TKey, TMessage> = {} as any
  private _labels: Record<TKey, string> = {} as any
  private _current: TKey | null = null

  register<T extends string, R extends Record<string, any>>(item: ILanguageItem<T, R>) {
    const that = this as any as LanguageCore<T | TKey, R | TMessage>
    ;(that._languageMessages as any)[item.value] = item.message
    that._labels[item.value] = item.label ?? item.value
    if (!this._current) that._current = item.value
    return that
  }

  setLocale(locale: TKey) {
    if (!this._languageMessages[locale]) throw new Error(`Unknown locale: ${locale}`)
    this._current = locale
  }

  get currentLocale() {
    return this._current!
  }

  get messages() {
    return this._languageMessages
  }

  t(path: string) {
    const keys = path.split(".")
    let obj: any = this.messages
    for (const k of keys) {
      if (obj == null) return path
      obj = obj[k]
    }
    return obj ?? path
  }

  get locales() {
    return Object.entries(this._labels).map(([value, label]) => ({ value, label })) as Array<{ value: TKey; label: string }>
  }
}

export const createLanguageCore = <TKey extends string = never, TMessage extends Record<string, any> = never>() => new LanguageCore<TKey, TMessage>()
