import { ResolvableValue, ResolvableValueRestable } from "../core"
import type { I18nResolveCxt, IResolvableValueRestable, LabelInput, TErrorMap } from "templify-form"

/**
 * function to transform string enum to array for element template
 * @param target string enum
 * @returns
 */
export function stringEnumTransform<T extends Record<string, string>>(target: T, filter?: (key: keyof T) => boolean) {
  const keys = Reflect.ownKeys(target).filter((x) => !filter || filter(x as keyof T)) as Array<keyof T & string>
  const values = Object.fromEntries(keys.map((key) => [key, target[key]])) as unknown as Record<keyof T & string, string>

  return {
    props: keys,
    labels: values,
  }
}

/**
 * unction to transform numberic enum to array for element template
 * @param target numberic enum
 * @returns
 */
export function numericEnumTransform<T extends Record<string, number>>(target: T) {
  const keys = Reflect.ownKeys(target).filter((x) => typeof x !== "number") as Array<keyof T>
  return {
    keys,
  }
}
/**
 * select's options for string enum
 * @param target
 * @param filter
 * @returns
 */
export function stringEnumOptions<T extends Record<string, string>>(target: T, filter?: (key: keyof T) => boolean) {
  const { labels, props } = stringEnumTransform(target, filter)
  return props.map((key, index) => {
    return {
      label: labels[index],
      value: key,
    }
  })
}

export function createZodErrorMap<T extends string, TValue extends string = string>() {
  return <TMap extends TErrorMap<T, TValue>>(map: TMap) => map
}
export function toResolvable<TCtx>(val: LabelInput<TCtx>): ResolvableValue<TCtx> {
  if (typeof val === "function") {
    return new ResolvableValue<TCtx>("", val)
  } else if (typeof val === "string") {
    return new ResolvableValue<TCtx>(val)
  }
  return val
}
export function toResolvableRestable<TCtx>(val: LabelInput<TCtx>): ResolvableValue<TCtx> & IResolvableValueRestable {
  if (typeof val === "function") {
    return new ResolvableValueRestable<TCtx>("", val)
  } else if (typeof val === "string") {
    return new ResolvableValueRestable<TCtx>(val)
  }
  if (isResolvableValueRestable(val)) return val
  throw new Error("Invalid value type")
}

export function resolvable<TCtx>(val: string, transformer: (ctx: TCtx, val: string) => string): ResolvableValue<TCtx> {
  return new ResolvableValue<TCtx>(val, transformer)
}

export const createResolvable = <T>() => resolvable<T>

export const createResolveI18n = createResolvable<I18nResolveCxt>()

export const isResolvableValueRestable = (obj: any): obj is IResolvableValueRestable => {
  return obj?.rest && typeof obj.rest === "function" && obj?.show && typeof obj.show === "function"
}
