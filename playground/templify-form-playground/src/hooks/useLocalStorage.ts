import { LocalStorageManager } from "@/utils"

export const useLocalStorage = <TKey extends string, TValue extends any>() => {
  const instance = LocalStorageManager.getInstance<TKey, TValue>()
  const getValue = instance.getValue.bind(instance)
  const setValue = instance.setValue.bind(instance)
  const removeKey = instance.removeKey.bind(instance)
  return {
    getValue,
    setValue,
    removeKey,
  }
}
