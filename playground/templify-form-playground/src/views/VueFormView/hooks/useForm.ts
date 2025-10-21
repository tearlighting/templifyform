import type { TI18nKey } from "language"
import { createUseTemplifyFormWithI18nResolvorVue } from "templify-form"
import { z } from "zod"

import { createZodErrorMap } from "@/utils"

const props = ["userName", "password", "code"] as const

const zodMap = createZodErrorMap<(typeof props)[number], TI18nKey>()({
  userName: {
    max: "defaultForm.userName.errors.maxLength",
    min: "defaultForm.userName.errors.required",
  },
  password: {
    max: "defaultForm.password.errors.maxLength",
    min: "defaultForm.password.errors.required",
  },
  code: {
    min: "defaultForm.code.errors.required",
  },
})

export const useForm = createUseTemplifyFormWithI18nResolvorVue({
  formTemplatePayload: {
    props: [...props],
    labels: {
      userName: ({ t }) => t("defaultForm.userName"),
      password: ({ t }) => t("defaultForm.password"),
      code: ({ t }) => t("defaultForm.code"),
    },
    formItemLabelClassNames: {
      userName: "w-30  pr-5",
      password: "w-30  pr-5",
      code: "w-30  pr-5",
    },

    errors: {
      password: ({ t }, value) => {
        return value && t(value as TI18nKey)
      },
      userName: ({ t }, value) => {
        return value && t(value as TI18nKey)
      },
      code: ({ t }, value) => {
        return value && t(value as TI18nKey)
      },
    },
  },
  formDataPayload: {
    shapes: {
      userName: z.string().max(10, zodMap.userName.max).min(1, zodMap.userName.min),
      password: z.string().max(10, zodMap.password.max).min(1, zodMap.password.min),
      code: z.string().length(4, zodMap.code.min),
    },
    defaultValues: {
      userName: "admin",
      password: "123456",
      code: "1234",
    },
  },
})
