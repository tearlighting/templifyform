import { createFormData, createFormTemplate } from "../../../../../lib/template"
import { ETemplateType } from "../../../../../lib/constants"
import { createFormStore, createZodValidator } from "../../../../../lib/core"
import type { IUseFormParam, InferShape, IFormTemplateItem } from "../../../../../types/templify-form"
import { nextTick, reactive, ref, toRefs, watch } from "vue"
import { z, ZodObject, type ZodType } from "zod"
import type { I18nResolveCxt } from "index"

export function useTemplifyForm<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TShape extends Record<TProp, ZodType>, TResolveCxt>({
  formDataPayload,
  formTemplatePayload,
}: IUseFormParam<TProp, TTypes, TShape, TResolveCxt>) {
  //初始化表单
  const initFormStore = () => {
    const initailFormTemplate: IFormTemplateItem<TProp, TResolveCxt, InferShape<TShape>>[] = createFormTemplate<TProp, TTypes, TResolveCxt, InferShape<TShape>>(formTemplatePayload)
    const { formData: initailFormData, schema } = createFormData({ ...formDataPayload, props: formTemplatePayload.props })

    //DI  reactive data
    const formDataReactive = reactive(initailFormData)
    const formTemplateReactive = reactive(initailFormTemplate)
    const formdataValidator = createZodValidator(schema, formDataReactive)
    const formStore = createFormStore(formTemplateReactive as any, formDataReactive, formdataValidator)
    const { isValid, errors } = formStore.getSnapshot()
    return {
      formData: formDataReactive,
      formTemplate: formTemplateReactive,
      formStore,
      isValid,
      errors,
    }
  }
  const { formData, formTemplate, formStore: formStoreIns, isValid, errors } = initFormStore()

  const isValidRef = ref(isValid)
  const errorsRef = ref(errors)

  let autoValidate = false
  const subscribeFormStoreChange = () => {
    const { isValid, errors } = formStoreIns.getSnapshot()
    isValidRef.value = isValid
    errorsRef.value = errors
  }
  const unsubscribe = formStoreIns.subscribe(subscribeFormStoreChange)
  let unsubscribed = false
  const unsubscribeWrapper = () => {
    if (unsubscribed) return
    unsubscribe()
    unsubscribed = true
  }

  const setError = formStoreIns.setError.bind(formStoreIns)

  const reset = (data?: Partial<typeof formData>) => {
    data = data ?? (formDataPayload.defaultValues as any)
    formStoreIns.reset(data as any)
    if (autoValidate) {
      autoValidate = false
      nextTick(() => {
        autoValidate = true
      })
    }
  }

  const validateAll = formStoreIns.validateAll.bind(formStoreIns)

  const validateField = formStoreIns.validateField.bind(formStoreIns)

  let isInitWatch = true
  const enableAutoValidate = () => {
    autoValidate = true

    if (isInitWatch) {
      isInitWatch = false
      for (let prop in formData) {
        watch(
          () => formData[prop as keyof typeof formData],
          () => autoValidate && validateField(prop as any)
        )
      }
    }
  }
  const disableAutoValidate = () => {
    autoValidate = false
  }
  return {
    formStore: {
      formData,
      formTemplate,
      isValid: isValidRef,
      errors: errorsRef,
    },
    setError,
    reset,
    validateAll,
    validateField,
    enableAutoValidate,
    disableAutoValidate,
    unsubscribe: unsubscribeWrapper,
  }
}

export const createUseTemplifyFormWithI18nResolvor =
  <TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TShape extends Record<TProp, ZodType>>({
    formDataPayload,
    formTemplatePayload,
  }: IUseFormParam<TProp, TTypes, TShape, I18nResolveCxt>) =>
  () =>
    useTemplifyForm({ formDataPayload, formTemplatePayload })
