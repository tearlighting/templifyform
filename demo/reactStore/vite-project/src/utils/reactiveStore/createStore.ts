import {
  useCallback,
  useState,
  useSyncExternalStore,
} from 'react';

import type {
  ISetData,
  ISubscriberParams,
} from 'reactiveStore';

import {
  effect,
  ref,
} from '@vue/reactivity';

export function createStore<T extends object>(initializer: (setData: ISetData<T>) => T) {
  const state = ref<T>(initializer(setData))
  function setData(callback: (state: T) => void) {
    callback(state.value)
  }
  const getState = () => state.value as T
  const setState = (partial: Partial<T> | ((s: T) => void)) => {
    if (typeof partial === "function") {
      partial(state.value)
    } else {
      Object.assign(state.value, partial)
    }
  }

  const subscribe = ({ callback, selector }: ISubscriberParams<T>) => {
    const runner = effect(() => {
      selector(state.value)
      callback()
    })
    return runner.effect.stop.bind(runner)
  }

  return {
    getState,
    setState,
    subscribe,
  }
}
export function createUseStore<T extends Object>(initializer: (setData: ISetData<T>) => T) {
  const store = createStore(initializer)
  function useStoreFactory(): T
  function useStoreFactory<S>(selector: (s: T) => S): S
  function useStoreFactory<S>(selector?: (s: T) => S) {
    return useStore(store, selector)
  }
  return Object.assign(useStoreFactory, { setState: store.setState.bind(store), getState: store.getState.bind(store) })
}
export function useStore<T extends object>(
  store: ReturnType<typeof createStore<T>>
): T
export function useStore<T extends object, S>(
  store: ReturnType<typeof createStore<T>>,
  selector?: (s: T) => S
): S
export function useStore<T extends Object, S>(store: ReturnType<typeof createStore<T>>, selector?: (s: T) => S) {
  const defaultSelector = useCallback((s: T) => s, [])
  const unNullableSelector = selector ?? defaultSelector
  const stableSubscriber = useCallback((callback: () => void) => {
    return store.subscribe({ callback, selector: unNullableSelector })
  }, [])
  const [stableSelector] = useState(() => () => unNullableSelector(store.getState()))

  return useSyncExternalStore(
    stableSubscriber,
    stableSelector
  )
}
