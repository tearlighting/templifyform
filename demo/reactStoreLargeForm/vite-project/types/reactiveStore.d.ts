import { createStore, createUseStore, useStore } from "../src/utils/reactiveStore"

export interface ISetData<T extends object> {
  (callback: (state: T) => void): void
}

export interface ISubscriberParams<T extends object> {
  /**
   * the callback of React's useSyncExternalStore
   *
   */
  callback: () => void
  /**
   *
   * the selector to get snapshot
   * @returns
   */
  selector: (s: T) => any
}

export type ReactiveStore<T = any> = ReturnType<typeof createUseStore<T>>

export { createStore, createUseStore, useStore }
