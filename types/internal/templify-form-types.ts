import type { ETemplateType } from "#/constants"
import type { ResolvableValue } from "#/core"
import type { z, ZodObject, ZodString, ZodType } from "zod"

export type LabelInput<T = any> = string | ((ctx: T, val: string) => string) | ResolvableValue<T>
export type LabelInputRestable<T = any> = string | ((ctx: T, val: string) => string) | (ResolvableValue<T> & IResolvableValueRestable)
/**
 * i18n要注入t
 */
export interface I18nResolveCxt {
  //   t: (key: string) => string
}

export interface ITemplifyForm {}
/**
 * 初始化参数
 */
export type ICreateFormTemplateProps<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TResolveCxt> = {
  props: TProp[]
  labels: Record<TProp, LabelInput<TResolveCxt>>
  types?: TTypes
  options?: Partial<{
    [key in TProp as TTypes[key] extends ETemplateType.select ? key : never]: IOptionItem[]
  }>
  readonlys?: Partial<Record<TProp, boolean>>
  /**
   * default error  for each prop
   */
  errors?: Partial<Record<TProp, LabelInputRestable<TResolveCxt>>>
  renders?: Partial<Record<TProp, IRender<TProp, TResolveCxt, Record<TProp, any>>>>
  formItemClassNames?: Partial<Record<TProp, string>>
  formItemLabelClassNames?: Partial<Record<TProp, string>>
  formItemContentClassNames?: Partial<Record<TProp, string>>
}
/**
 * 归一化之后的参数
 */
export type INormalizedCreateFormTemplateProps<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TResolveCxt> = Omit<
  Required<ICreateFormTemplateProps<TProp, TTypes, TResolveCxt>>,
  "labels" | "options" | "errors"
> & {
  labels: Record<TProp, ResolvableValue<TResolveCxt>>
  errors: Record<TProp, ResolvableValue<TResolveCxt>>
  options: Partial<{
    [key in TProp as TTypes[key] extends ETemplateType.select ? key : never]: INomalizedOptionItem<TResolveCxt>[]
  }>
}

/**
 * 下拉框配置
 */
export interface IOptionItem {
  label: LabelInput
  value: string
}

export interface INomalizedOptionItem<T> {
  label: ResolvableValue<T>
  value: string
}

/**
 * 当组件太复杂，通用组件满足不了时，可以手动配置render
 */
export type IRender<TProp extends string, TResolveCxt, TFormData> = (
  itemRaw: IFormTemplateItem<TProp, TResolveCxt, TFormData>,
  ...props: any[]
) => // item: IFormTemplateItem<TProp, TResolveCxt, TFormData>,
// formData: TFormData,
// t: TResolveCxt["t"],
// setField?: (key: TProp, val: any) => void
any

/**
 * formTemplate item
 */
export type IFormTemplateItem<TProp extends string, TResolveCxt, TFormData> = {
  prop: TProp
  label: ResolvableValue<TResolveCxt>
  type: ETemplateType
  option: INomalizedOptionItem<TResolveCxt>[]
  readonly?: boolean
  error: ResolvableValue<TResolveCxt> & IResolvableValueRestable
  render?: (item: IFormTemplateItem<TProp, TResolveCxt, TFormData>, ...args: any[]) => any
  formItemClassName?: string
  formItemLabelClassName?: string
  formItemContentClassName?: string
}
/**
 *hooks参数
 */
export interface IUseFormParam<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TShape extends Record<TProp, ZodType>, TResolveCxt> {
  formTemplatePayload: ICreateFormTemplateProps<TProp, TTypes, TResolveCxt>
  formDataPayload: Omit<ICreateFormDataProps<TProp, TShape>, "props">
}
/**
 * 推form data type
 */
export type InferShape<TShape extends Record<string, ZodType>> = {
  [K in keyof TShape]: z.infer<TShape[K]>
}
/**
 * 根据初始值创建Formdata
 */
export type ICreateFormDataProps<TProp extends string, TShape extends Record<TProp, ZodType>> = {
  props: TProp[]
  defaultValues?: Partial<InferShape<TShape>>
  shapes: TShape
  schemaRelations?: (payload: ZodObject) => ZodObject
}

export interface IResolvableValueRestable {
  rest(): void
  show(): void
}

export type TErrorMap<TKey extends string, TValue extends string = string> = Partial<Record<TKey, Partial<Record<keyof ZodString, TValue>>>>
