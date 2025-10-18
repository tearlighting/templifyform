import type { TI18nKey } from "language"
import { z } from "zod"

import { createZodErrorMap } from "@/utils"

import { createUseTemplifyFormStoreWithI18nResolvor } from "./hooks/useTemplifyFormStore"
import { ETemplateType } from "../../../../lib/constants"
import dayjs from "dayjs"

import { INomalizedOptionItem } from "../../../../types/templify-form"
import { ResolvableValue } from "../../../../lib/core/ResolvableValue"

const props = [
  "userName",
  "password",
  "code",
  "email",
  "phone",
  "age",
  "gender",
  "country",
  "city",
  "address",
  "zipCode",
  "receiveNewsletter",
  "color",
  "bio",
  "occupation",
  "salary",
  "startDate",
  "endDate",
  "terms",
  "notes",
] as const

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
  email: {
    type: "email.errors.invalid",
  },
  phone: {
    type: "phone.errors.invalid",
  },
  age: {
    min: "age.errors.min",
    max: "age.errors.max",
  },
  terms: {
    min: "terms.errors.required",
  },
})

const resolvableValue = (func: (payload: { t: (key: TI18nKey) => string }) => string) => new ResolvableValue("", func)

export const citys: Record<
  "china" | "japan" | "usa",
  Array<
    INomalizedOptionItem<{
      t: (key: TI18nKey) => string
    }>
  >
> = {
  china: [
    { label: resolvableValue(({ t }) => t("options.city.china.shanghai")), value: "ShangHai" },
    { label: resolvableValue(({ t }) => t("options.city.china.shenzhen")), value: "Shenzhen" },
    { label: resolvableValue(({ t }) => t("options.city.china.guangzhou")), value: "Guangzhou" },
  ],
  usa: [
    { label: resolvableValue(({ t }) => t("options.city.usa.newyork")), value: "NewYork" },
    { label: resolvableValue(({ t }) => t("options.city.usa.losangeles")), value: "LosAngeles" },
    { label: resolvableValue(({ t }) => t("options.city.usa.chicago")), value: "Chicago" },
  ],
  japan: [
    { label: resolvableValue(({ t }) => t("options.city.japan.tokyo")), value: "Tokyo" },
    { label: resolvableValue(({ t }) => t("options.city.japan.osaka")), value: "Osaka" },
    { label: resolvableValue(({ t }) => t("options.city.japan.kyoto")), value: "Kyoto" },
  ],
}
export const useFormStoreFactory = createUseTemplifyFormStoreWithI18nResolvor({
  formTemplatePayload: {
    props: [...props],
    labels: {
      userName: ({ t }) => t("userName"),
      password: ({ t }) => t("password"),
      code: ({ t }) => t("code"),
      email: ({ t }) => t("email"),
      phone: ({ t }) => t("phone"),
      age: ({ t }) => t("age"),
      gender: ({ t }) => t("gender"),
      country: ({ t }) => t("country"),
      city: ({ t }) => t("city"),
      address: ({ t }) => t("address"),
      zipCode: ({ t }) => t("zipCode"),
      receiveNewsletter: ({ t }) => t("receiveNewsletter"),

      color: ({ t }) => t("color"),
      bio: ({ t }) => t("bio"),
      occupation: ({ t }) => t("occupation"),
      salary: ({ t }) => t("salary"),
      startDate: ({ t }) => t("startDate"),
      endDate: ({ t }) => t("endDate"),
      terms: ({ t }) => t("terms"),
      notes: ({ t }) => t("notes"),
    },
    types: {
      gender: ETemplateType.select,
      country: ETemplateType.select,
      city: ETemplateType.select,
      receiveNewsletter: ETemplateType.switch,
      startDate: ETemplateType.date,
      endDate: ETemplateType.date,

      bio: ETemplateType.textarea,
      terms: ETemplateType.checkbox,
      age: ETemplateType.number,
      salary: ETemplateType.number,
      address: ETemplateType.textarea,
      color: ETemplateType.color,
    },
    options: {
      gender: [
        { label: ({ t }) => t("options.gender.male"), value: "male" },
        { label: ({ t }) => t("options.gender.female"), value: "female" },
      ],
      country: [
        { label: ({ t }) => t("options.country.japan"), value: "Japan" },
        { label: ({ t }) => t("options.country.usa"), value: "USA" },
        { label: ({ t }) => t("options.country.china"), value: "China" },
      ],
      city: citys.japan,
    },
    formItemLabelClassNames: Object.fromEntries(props.map((p) => [p, "formLabel"])),
    errors: Object.fromEntries(props.map((p) => [p, ({ t }, value) => value && t(value as TI18nKey)])),
  },
  formDataPayload: {
    shapes: {
      userName: z.string().min(1, zodMap.userName.min).max(10, zodMap.userName.max),
      password: z.string().min(1, zodMap.password.min).max(10, zodMap.password.max),
      code: z.string().length(4, zodMap.code.min),
      email: z.email(zodMap.email.type),
      phone: z.string().regex(/^[0-9]{10,12}$/, zodMap.phone.type),
      age: z.number().min(0, zodMap.age.min).max(120, zodMap.age.max),
      gender: z.string(),
      country: z.string(),
      city: z.string().max(50),
      address: z.string().max(100).optional(),
      zipCode: z.string().max(10),
      receiveNewsletter: z.boolean(),
      color: z.string().optional(),
      bio: z.string().max(300).optional(),
      occupation: z.string().optional(),
      salary: z.number().min(0).max(10000000).optional(),
      startDate: z.string(),
      endDate: z.string(),
      terms: z.boolean().refine((v) => v === true, zodMap.terms.min),
      notes: z.string().optional(),
    },
    defaultValues: {
      userName: "admin",
      password: "123456",
      code: "1234",
      receiveNewsletter: true,
      gender: "male",
      country: "Japan",
      terms: true,
      email: "admin@example.com",
      phone: "1234567890",
      age: 30,
      city: "Tokyo",
      address: "Tokyo Station",
      zipCode: "123456",
      color: "#1947de",
      bio: "",
      occupation: "engineer",
      salary: 1000000,
      startDate: dayjs().format("YYYY-MM-DD"),
      endDate: dayjs().add(1, "month").format("YYYY-MM-DD"),
      notes: "",
    },
  },
})()
