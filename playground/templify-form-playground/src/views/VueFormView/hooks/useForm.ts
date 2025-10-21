import type { TI18nKey } from 'language';
import { createUseTemplifyFormWithI18nResolvorVue } from 'templify-form';
import { z } from 'zod';

import { createZodErrorMap } from '@/utils';

const props = ["userName", "password", "code"] as const

const zodMap = createZodErrorMap<(typeof props)[number], TI18nKey>()({
    userName: {
        max: "userName.errors.maxLength",
        min: "userName.errors.required",
    },
    password: {
        max: "password.errors.maxLength",
        min: "password.errors.required",
    },
    code: {
        min: "code.errors.required",
    },
})

export const useForm = createUseTemplifyFormWithI18nResolvorVue<{ t: any }>()({
    formTemplatePayload: {
        props: [...props],
        labels: {
            userName: ({ t }) => t("userName"),
            password: ({ t }) => t("password"),
            code: ({ t }) => t("code"),
        },
        formItemLabelClassNames: {
            userName: "formLabel",
            password: "formLabel",
            code: "formLabel",
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
