export class LocalStorageManager<TKey extends string, TValue> implements ILocalStorage<TKey, TValue> {
  getValue(key: TKey): TValue | null {
    const res = localStorage.getItem(key)
    return res && JSON.parse(res)
  }
  setValue(key: string, value: TValue): void {
    localStorage.setItem(key, JSON.stringify(value))
  }
  removeKey(key: TKey): void {
    localStorage.removeItem(key)
  }
  private constructor() {}
  static _instance: LocalStorageManager<any, any>
  static getInstance<TKey extends string, TValue>(): LocalStorageManager<TKey, TValue> {
    if (!LocalStorageManager._instance) {
      LocalStorageManager._instance = new LocalStorageManager<TKey, TValue>()
    }
    return LocalStorageManager._instance
  }
}
