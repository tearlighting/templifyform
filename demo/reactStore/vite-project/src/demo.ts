import { z } from "zod"
import { useForm4Rect, useForm4RectFactory, ETemplateType } from "../../../../src/core"
enum EFormItem {
  name = "name",
  region = "region",
  type = "type",
}

const stringeEnum2Form = <T extends Record<string, string>>(enumObj: T) => {
  const props = Reflect.ownKeys(enumObj) as Array<keyof T>
  const labels = Object.values(enumObj) as Array<string>
  return {
    props,
    labels,
  }
}

const { props, labels } = stringeEnum2Form(EFormItem)

export const useForm = useForm4RectFactory({
  formTemplatePayload: {
    props,
    labels,
    types: {
      type: ETemplateType.select,
    },
    errors: {
      name: "请输入姓名",
      region: "请选择地区",
    },
    options: {
      type: [
        {
          label: 1,
          value: 1,
        },
        {
          label: 2,
          value: 2,
        },
      ],
    },
  },
  formDataPayload: {
    defaultValues: {
      name: "张三",
      region: "北京",
      type: "1",
    },
    shapes: {
      name: z.string().max(3, { message: "姓名不能超过3个字符" }),
      region: z.string(),
      type: z.string(),
    },
  },
})

export { ETemplateType }
