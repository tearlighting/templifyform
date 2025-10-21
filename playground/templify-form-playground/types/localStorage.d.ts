interface ILocalStorage<TKey extends string, TValue> {
  getValue(key: TKey): null | TValue
  setValue(key: TKey, value: TValue): void
  removeKey(key: TKey): void
}
