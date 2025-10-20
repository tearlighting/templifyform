import { ETemplateType } from "#/constants"
import { createFormStore, createZodValidator } from "#/core"
import { createFormData, createFormTemplate } from "#/template"
import { createUseStore } from "#/utils/reactiveStore"
import { InferShape, IUseFormParam } from "templify-form"
import { ZodType } from "zod"

import { reactive } from "@vue/reactivity"

export function createUseTemplifyFormStore<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TShape extends Record<TProp, ZodType>, TResolveCxt>({
  formDataPayload,
  formTemplatePayload,
}: IUseFormParam<TProp, TTypes, TShape, TResolveCxt>) {
  const initFormStore = () => {
    const initailFormTemplate = createFormTemplate<TProp, TTypes, TResolveCxt, InferShape<TShape>>(formTemplatePayload)
    const { formData: initailFormData, schema } = createFormData({ ...formDataPayload, props: formTemplatePayload.props })
    const formdataValidator = createZodValidator(schema, initailFormData)
    const formStore = createFormStore(initailFormTemplate as any, initailFormData, formdataValidator)
    return formStore
  }
  const formStoreIns = initFormStore()

  let autoValidate = false

  const formStore = reactive({ ...formStoreIns.getSnapshot() })

  const subscribeFormStoreChange = () => {
    Object.assign(formStore, formStoreIns.getSnapshot())
  }
  const unsubscribe = formStoreIns.subscribe(subscribeFormStoreChange)
  let unsubscribed = false
  const unsubscribeWrapper = () => {
    if (unsubscribed) return
    unsubscribe()
    unsubscribed = true
  }

  const setError = formStoreIns.setError.bind(formStoreIns)

  const reset = (data?: Partial<typeof formStore.formData>) => {
    data = data ?? (formDataPayload.defaultValues as any)
    formStoreIns.reset(data as any)
  }

  const validateAll = formStoreIns.validateAll.bind(formStoreIns)

  const validateField = formStoreIns.validateField.bind(formStoreIns)

  const setField = <K extends keyof typeof formStore.formData & string>(key: K, value: (typeof formStore.formData)[K]) => {
    formStoreIns.setFormData({ [key]: value } as any, !autoValidate)
    if (autoValidate) {
      formStoreIns.validateField(key as any)
    }
  }
  const setFormTemplate = formStoreIns.setFormTemplate.bind(formStoreIns)

  const enableAutoValidate = () => {
    autoValidate = true
  }
  const disableAutoValidate = () => {
    autoValidate = false
  }
  return createUseStore(() => {
    return {
      formStore,
      unsubscribe: unsubscribeWrapper,
      setError,
      reset,
      validateAll,
      validateField,
      setField,
      setFormTemplate,
      enableAutoValidate,
      disableAutoValidate,
    }
  })
}
