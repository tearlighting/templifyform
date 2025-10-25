import type { ILanguageItem } from "language"

import { LanguageCore } from "../core"

export class LanguageCoreWithPlugin<TKey extends string = never, TMessage extends Record<string, any> = {}> extends LanguageCore<TKey, TMessage> {
  private _plugins: IPlugin<typeof LanguageCoreWithPlugin<TKey, TMessage>>[] = []
  usePlugin(plugin: IPlugin<typeof LanguageCoreWithPlugin<TKey, TMessage>>): this {
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
  register<T extends string, R extends Record<string, any>>(item: ILanguageItem<T, R>) {
    super.register(item)
    return this as LanguageCoreWithPlugin<TKey | T, TMessage & R>
  }
}

export const createLanguageCoreWithPlugins = <TKey extends string = never, TMessage extends Record<string, any> = {}>() => new LanguageCoreWithPlugin<TKey, TMessage>()
