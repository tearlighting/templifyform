import { RefObject, useRef } from "react"

export function useLazyRef<T>(initValueFactory: () => T) {
  const ref = useRef<T | null>(null)
  if (!ref.current) {
    ref.current = initValueFactory()
  }
  return ref as RefObject<T>
}
