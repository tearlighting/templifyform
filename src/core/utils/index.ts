import { ETemplateType } from "../enums"
import { ICreateFormData, ICreateFormTemplate, IFormItem, IOptionItem, IRender } from "../types"
import { z, type ZodType } from "zod"
export * from "./zodValidator"

export function createFormTemplate<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>>(payload: ICreateFormTemplate<TProp, TTypes>) {
  // TODO: create form template
  const normalizeParams = (params: ICreateFormTemplate<TProp, TTypes>) => {
    const { props, labels, types = {}, options = {}, readonlys = {}, errors = {}, renders = {} } = params
    if (props.length !== labels.length) throw new Error("props and labels length must be equal")
    return { props, labels, types, options, readonlys, errors, renders } as Required<ICreateFormTemplate<TProp, TTypes>>
  }
  const { props, labels, types, options, readonlys, errors, renders } = normalizeParams(payload)
  return props.map((prop, index) => {
    const label = labels[index]
    const type: ETemplateType = types[prop] ? types[prop] : ETemplateType.input
    const readonly: boolean = readonlys[prop] ? readonlys[prop] : false
    const option: IOptionItem[] = options[prop as keyof typeof options] ? options[prop as keyof typeof options]! : []
    const error: string = errors[prop] ? errors[prop] : ""
    const res = { prop, label, type, readonly, option, error, render: undefined as unknown as () => Object }
    if (renders[prop]) {
      res.render = function () {
        return renders[prop]!(res as any)
      }
    }
    return res
  })
}

export function createFormData<TProp extends string, TShape extends Record<TProp, ZodType>>(payload: ICreateFormData<TProp, TShape>) {
  const normalizeParams = (params: ICreateFormData<TProp, TShape>) => {
    const { props, defaultValues = {}, shapes, schemaCallBack } = params

    if (props.length !== Object.keys(shapes).length) throw new Error("props and defaultValues length must be equal")
    return { props, defaultValues, schemaCallBack, shapes } as Required<ICreateFormData<TProp, TShape>>
  }
  const { defaultValues, schemaCallBack, shapes, props } = normalizeParams(payload)
  const schema = z.object(shapes)
  schemaCallBack && schemaCallBack(schema)

  const formData = Object.fromEntries(props.map((prop) => [prop, defaultValues[prop as keyof typeof defaultValues] || null])) as z.infer<typeof schema>
  for (let key in defaultValues) {
    ;(formData as any)[key] = defaultValues[key]
  }
  return {
    schema,
    formData,
  }
}
