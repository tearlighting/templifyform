import { onMounted } from "vue"
import { useForm4Vue, ETemplateType } from "../../../../src/core"
import { z } from "zod"

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

export const useForm = () => {
  const { props, labels } = stringeEnum2Form(EFormItem)
  const { watch, formData, formTemplate } = useForm4Vue({
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
  onMounted(() => {
    watch()
  })

  return {
    formData,
    formTemplate,
    // reset,
    watch,
  }
}

export { ETemplateType }
