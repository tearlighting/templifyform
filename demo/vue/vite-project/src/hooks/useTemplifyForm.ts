import { createFormData, createFormTemplate } from "../../../../../lib/template"
import { ETemplateType } from "../../../../../lib/constants"
import { createFormStore, createZodValidator } from "../../../../../lib/core"
import type { IUseFormParam, InferShape, IFormTemplateItem } from "../../../../../types/templify-form"
import { nextTick, reactive, ref, watch } from "vue"
import { z, ZodObject, type ZodType } from "zod"
import type { I18nResolveCxt } from "index"

export function useTemplifyForm<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TShape extends Record<TProp, ZodType>, TResolveCxt>({
  formDataPayload,
  formTemplatePayload,
}: IUseFormParam<TProp, TTypes, TShape, TResolveCxt>) {
  //初始化表单
  const formTemplate: IFormTemplateItem<TProp, TResolveCxt, z.infer<ZodObject<TShape>>>[] = createFormTemplate<TProp, TTypes, TResolveCxt, InferShape<TShape>>(formTemplatePayload)
  const { formData, schema }: { formData: z.infer<ZodObject<TShape>>; schema: ZodObject<TShape> } = createFormData({ ...formDataPayload, props: formTemplatePayload.props })
  const formDataReactive = reactive(formData)
  const formTemplateReactive = reactive(formTemplate)
  //为了对应v-model,只能注入响应式数据
  const formdataValidator = createZodValidator(schema, formDataReactive as typeof formData)
  const formStore = createFormStore(formTemplateReactive as any, formDataReactive as typeof formData, formdataValidator)
  const { isValid, errors } = formStore.getSnapshot()
  //初始化响应式数据
  const isValidRef = ref(isValid)
  const errorsRef = ref(errors)
  let isProgrammaticChangeFormData = false

  formStore.subscribe((data) => {
    isValidRef.value = data.isValid
    errorsRef.value = data.errors
  })
  function setError(...args: Parameters<typeof formStore.setError>) {
    formStore.setError(...args)
  }
  /**
   *重新设置formData，并清空之前的错误信息
   * @param data
   * @description 其实这边有点小问题，就是如果设置了enableAutoValidate，
   * 这个是异步触发错误，虽然说我同步的时候是没有问题的，
   * 但是这个异步触发就有问题了
   * 怎么办？加flag,当然vue的好处是，nexttick是发生在watch之后，
   * 相当于一个宏任务，nexttick里面把flag改了，就不会触发watch了
   * 但是react的setData之后犹豫Scheduler的异步性，是没法这么玩的，
   * 但是，因为这是封装在一起的，react压根就不会存在这个问题
   *
   */
  function reset(data?: Partial<typeof formData>) {
    isProgrammaticChangeFormData = true
    data = data ?? (formDataPayload.defaultValues as any)
    formStore.reset(data)
    nextTick(() => {
      isProgrammaticChangeFormData = false
    })
  }
  function validateAll() {
    formStore.validateAll()
  }
  function validateField(...args: Parameters<typeof formStore.validateField>) {
    formStore.validateField(...args)
  }

  function enableAutoValidate() {
    for (let prop in formDataReactive) {
      watch(
        () => formDataReactive[prop as keyof typeof formDataReactive],
        () => isProgrammaticChangeFormData || validateField(prop as any)
      )
    }
  }
  return {
    formData: formDataReactive,
    formTemplate: formTemplateReactive,
    isValid: isValidRef,
    errors: errorsRef,
    setError,
    reset,
    validateAll,
    validateField,
    enableAutoValidate,
  }
}

export const createUseTemplifyFormWithI18nResolvor =
  <TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TShape extends Record<TProp, ZodType>>({
    formDataPayload,
    formTemplatePayload,
  }: IUseFormParam<TProp, TTypes, TShape, I18nResolveCxt>) =>
  () =>
    useTemplifyForm({ formDataPayload, formTemplatePayload })
