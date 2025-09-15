import { createFormData, createFormTemplate } from "../../../../../lib/template"
import { ETemplateType } from "../../../../../lib/constants"
import { createFormStore, createZodValidator } from "../../../../../lib/core"
import type { IUseFormParam, InferShape, IFormTemplateItem } from "../../../../../types/templify-form"
import { z, ZodObject, type ZodType } from "zod"
import type { I18nResolveCxt } from "index"
import { useCallback, useRef, useSyncExternalStore } from "react"
import { useLazyRef } from "./useLasyRef"

export function useTemplifyForm<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TShape extends Record<TProp, ZodType>, TResolveCxt>({
  formDataPayload,
  formTemplatePayload,
}: IUseFormParam<TProp, TTypes, TShape, TResolveCxt>) {
  //初始化表单

  const formStoreRef = useLazyRef(() => {
    const formTemplate: IFormTemplateItem<TProp, TResolveCxt, z.infer<ZodObject<TShape>>>[] = createFormTemplate<TProp, TTypes, TResolveCxt, InferShape<TShape>>(formTemplatePayload)
    const { formData, schema }: { formData: z.infer<ZodObject<TShape>>; schema: ZodObject<TShape> } = createFormData({ ...formDataPayload, props: formTemplatePayload.props })
    const formdataValidator = createZodValidator(schema, formData)
    const formStore = createFormStore(formTemplate, formData, formdataValidator)
    return formStore
  })
  const autoValidateRef = useRef(false)

  const subscribe = useCallback((s: () => void) => {
    console.log("subscribe")
    return formStoreRef.current.subscribe(s)
  }, [])
  const { isValid, errors, formTemplate, formData } = useSyncExternalStore(subscribe, () => formStoreRef.current.getSnapshot())

  /**
   * 设置错误信息，并publish
   * @param args
   */
  const setError = useCallback((...args: Parameters<typeof formStoreRef.current.setError>) => {
    formStoreRef.current.setError(...args)
  }, [])
  /**
   *重新设置formData，并清空之前的错误信息
   * @param data
   *
   */
  const reset = useCallback((data?: Partial<typeof formData>) => {
    data = data ?? (formDataPayload.defaultValues as any)
    formStoreRef.current.reset(data)
  }, [])
  const validateAll = useCallback(() => {
    formStoreRef.current.validateAll()
  }, [])
  const validateField = useCallback((...args: Parameters<typeof formStoreRef.current.validateField>) => {
    formStoreRef.current.validateField(...args)
  }, [])
  // 单字段更新，需要调用方决定是否触发全量校验
  const setField = useCallback(<K extends keyof typeof formData & string>(key: K, value: (typeof formData)[K]) => {
    formStoreRef.current.setFormData({ [key]: value } as any, !autoValidateRef.current)
    if (autoValidateRef.current) {
      formStoreRef.current.validateField(key as any)
    }
  }, [])

  // 多字段更新，需要调用方决定是否触发全量校验
  const setFields = useCallback((fields: Partial<typeof formData>, triggerAllValid = false) => {
    formStoreRef.current.setFormData(fields, !triggerAllValid)
    if (triggerAllValid) {
      formStoreRef.current.validateAll()
    }
  }, [])
  const setFormTemplate = useCallback((...args: Parameters<typeof formStoreRef.current.setFormTemplate>) => {
    formStoreRef.current.setFormTemplate(...args)
  }, [])
  const enableAutoValidate = useCallback(() => {
    autoValidateRef.current = true
  }, [])
  return {
    formData,
    formTemplate,
    isValid,
    errors,
    setError,
    reset,
    validateAll,
    validateField,
    enableAutoValidate,
    setField,
    setFields,
    setFormTemplate,
  }
}

export const createUseTemplifyFormWithI18nResolvor =
  <TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TShape extends Record<TProp, ZodType>>({
    formDataPayload,
    formTemplatePayload,
  }: IUseFormParam<TProp, TTypes, TShape, I18nResolveCxt>) =>
  () =>
    useTemplifyForm({ formDataPayload, formTemplatePayload })
