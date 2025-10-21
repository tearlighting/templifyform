/**
 * 问题，泛型类型锁死,暂时无解，至少我不会
 * @param Base
 * @returns
 */
export function withPlugins<T extends Constructor>(Base: T) {
  class WithPlugins extends Base implements IWithPlugins<T> {
    private _plugins: IPlugin<T>[] = []
    usePlugin(plugin: IPlugin<T>) {
      this._plugins.push(plugin)
      plugin.mount(this as any)
      return this as any
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
  }

  return WithPlugins as unknown as Constructor<ConstructorParameters<T>, InstanceType<T> & IWithPlugins<T>>
}
