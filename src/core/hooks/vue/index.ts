import { ETemplateType } from "src/core/enums"
import type { ZodType } from "zod"
import type { IUSeFormParam } from "../../types"
import { createFormData, createFormTemplate, ZodValidator } from "../../../core/utils"
import { onUnmounted, reactive } from "vue"

export function useForm4Vue<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TShape extends Record<TProp, ZodType>>({
  formDataPayload,
  formTemplatePayload,
}: IUSeFormParam<TProp, TTypes, TShape>) {
  const formTemplate = reactive(createFormTemplate(formTemplatePayload))
  const { formData: formDataRaw, schema } = createFormData({ ...formDataPayload, props: formTemplatePayload.props })
  const formdataValidator = new ZodValidator(schema, formDataRaw)

  let lastFormValid = false

  const unsubscribe = formdataValidator.subscribe(({ valid, error }) => {
    if (valid) {
      if (!lastFormValid) {
        formTemplate.forEach((item) => {
          item.error = ""
        })
      }
    } else {
      formTemplate.forEach((item) => {
        item.error = error![item.prop]
      })
    }

    lastFormValid = valid
  })
  function watch() {
    formdataValidator.watch()
  }
  function reset() {
    formdataValidator.reset(formDataPayload.defaultValues as any)
  }

  onUnmounted(() => {
    unsubscribe()
  })

  return {
    watch,
    formTemplate,
    formData: reactive(formDataRaw),
    reset,
  }
}
