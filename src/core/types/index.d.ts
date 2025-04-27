import type { ETemplateType } from "../enums/index"
import type { ZodObject, ZodType } from "zod"
import type { createFormTemplate } from "../utils"

export type IOptionItem = {
  label: string
  value: string
}
export type IFormItem = ReturnType<typeof createFormTemplate>
export type IRender = (item: IFormItem) => Object

export type ICreateFormTemplate<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>> = {
  props: TProp[]
  labels: string[]
  types?: TTypes
  options?: Partial<{
    [key in TProp as TTypes[key] extends ETemplateType.select ? key : never]: IOptionItem[]
  }>
  readonlys?: Partial<Record<TProp, boolean>>
  /**
   * default error  for each prop
   */
  errors?: Partial<Record<TProp, string>>
  renders?: Partial<Record<TProp, IRender>>
}

export type ICreateFormData<TProp extends string, TShape extends Record<TProp, ZodType>> = {
  props: TProp[]
  defaultValues: Partial<Record<TProp, string>>
  shapes: TShape
  schemaCallBack?: (payload: ZodObject) => void
}

export interface IUSeFormParam<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TShape extends Record<TProp, ZodType>> {
  formTemplatePayload: ICreateFormTemplate<TProp, TTypes>
  formDataPayload: Omit<ICreateFormData<TProp, TShape>, "props">
}
