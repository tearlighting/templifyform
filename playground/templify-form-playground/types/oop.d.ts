type AbstractConstructor<T = any> = abstract new (...args: any[]) => T

type Constructor<TArgs extends any[] = any[], TReturn extends any = any> = new (...args: TArgs) => TReturn

interface IPlugin<T extends Constructor> {
  mount(instance: InstanceType<T>): void
  unmount(instance: InstanceType<T>): void
}

interface IWithPlugins<T extends Constructor> {
  usePlugin(plugin: IPlugin<T>): this
  destroyPlugin(): boolean
}
type ReplaceCore<This, NewCore> = Omit<This, keyof NewCore> & NewCore
