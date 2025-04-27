import { ETemplateType } from "src/core/enums"
import type { ZodType } from "zod"
import type { IUSeFormParam } from "../../types"
import { createFormData, createFormTemplate, ZodValidator } from "../../../core/utils"
import { useEffect, useMemo, useRef, useState } from "react"

export function useForm4Rect<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TShape extends Record<TProp, ZodType>>({
  formDataPayload,
  formTemplatePayload,
}: IUSeFormParam<TProp, TTypes, TShape>) {
  //   useEffect(() => {
  //     console.log(formTemplatePayload, formDataPayload)
  //   }, [formDataPayload, formTemplatePayload])
  const [formTemplate, setFormTemplate] = useState(createFormTemplate(formTemplatePayload))
  const formDataRef = useRef(createFormData({ ...formDataPayload, props: formTemplatePayload.props }))
  const { schema, formData: formDataRaw } = formDataRef.current
  const formdataValidator = useRef(new ZodValidator(schema, formDataRaw))

  const [formData, setFormData] = useState(formDataRaw)
  //   console.log(formData)

  useEffect(() => {
    const unsubscribe = formdataValidator.current.subscribe(({ valid, error }) => {
      setFormTemplate((formTemplatePre) => {
        const res = formTemplatePre.map((item) => ({
          ...item,
          error: valid ? "" : error![item.prop] ?? "",
        }))

        return res
      })
    })
    watch()

    return () => unsubscribe() as any
  }, [])

  function watch() {
    formdataValidator.current.watch()
  }

  function setValue(key: TProp, value: any): void
  function setValue(formData: typeof formDataRaw): void
  function setValue(payload1: any, value?: any) {
    if (typeof payload1 === "string") {
      formdataValidator.current.setValue(payload1, value)
    } else {
      for (let key in payload1) {
        formdataValidator.current.setValue(key, payload1[key])
      }
    }
    setFormData(formdataValidator.current.formData)
  }

  function reset() {
    formdataValidator.current.reset(formDataPayload.defaultValues as any)
    setFormData(formdataValidator.current.formData)
  }
  function handleSubmit(callback: (formdata: typeof formDataRaw) => void) {
    watch()
    formdataValidator.current.validate().valid && callback(formDataRaw)
  }

  return {
    watch,
    formTemplate,
    formData,
    setValue,
    reset,
    handleSubmit,
  }
}

export function useForm4RectFactory<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TShape extends Record<TProp, ZodType>>({
  formDataPayload,
  formTemplatePayload,
}: IUSeFormParam<TProp, TTypes, TShape>) {
  return () => useForm4Rect({ formDataPayload, formTemplatePayload })
}
