import type { ZodString } from "zod"
export function createZodErrorMap<T extends string, TValue extends string = string>() {
  return <TMap extends TErrorMap<T, TValue>>(map: TMap) => map
}
export type TErrorMap<TKey extends string, TValue extends string = string> = Partial<Record<TKey, Partial<Record<keyof ZodString, TValue>>>>
