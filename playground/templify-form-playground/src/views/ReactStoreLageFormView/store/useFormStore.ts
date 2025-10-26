import type { TI18nKey } from "language"
import { z } from "zod"

import { createZodErrorMap } from "@/utils"

import { createUseTemplifyFormStoreWithI18nResolvor, ETemplateType, ResolvableValue, type INomalizedOptionItem } from "templify-form"

import dayjs from "dayjs"

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
    max: "largeForm.userName.errors.maxLength",
    min: "largeForm.userName.errors.required",
  },
  password: {
    max: "largeForm.password.errors.maxLength",
    min: "largeForm.password.errors.required",
  },
  code: {
    min: "largeForm.code.errors.required",
  },
  email: {
    type: "largeForm.email.errors.invalid",
  },
  phone: {
    type: "largeForm.phone.errors.invalid",
  },
  age: {
    min: "largeForm.age.errors.min",
    max: "largeForm.age.errors.max",
  },
  terms: {
    min: "largeForm.terms.errors.required",
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
    { label: resolvableValue(({ t }) => t("largeForm.options.city.china.shanghai")), value: "ShangHai" },
    { label: resolvableValue(({ t }) => t("largeForm.options.city.china.shenzhen")), value: "Shenzhen" },
    { label: resolvableValue(({ t }) => t("largeForm.options.city.china.guangzhou")), value: "Guangzhou" },
  ],
  usa: [
    { label: resolvableValue(({ t }) => t("largeForm.options.city.usa.newyork")), value: "NewYork" },
    { label: resolvableValue(({ t }) => t("largeForm.options.city.usa.losangeles")), value: "LosAngeles" },
    { label: resolvableValue(({ t }) => t("largeForm.options.city.usa.chicago")), value: "Chicago" },
  ],
  japan: [
    { label: resolvableValue(({ t }) => t("largeForm.options.city.japan.tokyo")), value: "Tokyo" },
    { label: resolvableValue(({ t }) => t("largeForm.options.city.japan.osaka")), value: "Osaka" },
    { label: resolvableValue(({ t }) => t("largeForm.options.city.japan.kyoto")), value: "Kyoto" },
  ],
}
export const useFormStore = createUseTemplifyFormStoreWithI18nResolvor({
  formTemplatePayload: {
    props: [...props],
    labels: {
      userName: ({ t }) => t("largeForm.userName"),
      password: ({ t }) => t("largeForm.password"),
      code: ({ t }) => t("largeForm.code"),
      email: ({ t }) => t("largeForm.email"),
      phone: ({ t }) => t("largeForm.phone"),
      age: ({ t }) => t("largeForm.age"),
      gender: ({ t }) => t("largeForm.gender"),
      country: ({ t }) => t("largeForm.country"),
      city: ({ t }) => t("largeForm.city"),
      address: ({ t }) => t("largeForm.address"),
      zipCode: ({ t }) => t("largeForm.zipCode"),
      receiveNewsletter: ({ t }) => t("largeForm.receiveNewsletter"),

      color: ({ t }) => t("largeForm.color"),
      bio: ({ t }) => t("largeForm.bio"),
      occupation: ({ t }) => t("largeForm.occupation"),
      salary: ({ t }) => t("largeForm.salary"),
      startDate: ({ t }) => t("largeForm.startDate"),
      endDate: ({ t }) => t("largeForm.endDate"),
      terms: ({ t }) => t("largeForm.terms"),
      notes: ({ t }) => t("largeForm.notes"),
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
        { label: ({ t }) => t("largeForm.options.gender.male"), value: "male" },
        { label: ({ t }) => t("largeForm.options.gender.female"), value: "female" },
      ],
      country: [
        { label: ({ t }) => t("largeForm.options.country.japan"), value: "Japan" },
        { label: ({ t }) => t("largeForm.options.country.usa"), value: "USA" },
        { label: ({ t }) => t("largeForm.options.country.china"), value: "China" },
      ],
      city: citys.japan,
    },
    formItemLabelClassNames: Object.fromEntries(props.map((p) => [p, "formLabel"])),
    errors: Object.fromEntries(props.map((p) => [p, ({ t }: { t: (k: TI18nKey) => string }, value: string | undefined) => value && t(value as TI18nKey)])),
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
})
