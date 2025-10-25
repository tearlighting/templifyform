import { useTemplifyForm } from "../context/TemplifyFormProvider"
import { useRef } from "react"

export function useTemplifyFieldSubscription({ prop }: { prop: string }) {
  const { formStore: storeFactory } = useTemplifyForm()
  //监听值的变化
  storeFactory((s) => s.formStore.formData[prop])
  const preItem = useRef({} as any)
  //监听模板的变化,但是为了i18n，error是一个对象不会变，还要手动去监听errors的变化
  storeFactory((s) => {
    const item = s.formStore.formTemplate?.find((item) => item.prop === prop)!
    for (let key in item) {
      const keyWithType = key as keyof typeof item
      if (!Object.is(preItem.current[keyWithType], item[keyWithType])) {
        preItem.current = {
          ...item,
        }
        break
      }
    }

    return preItem.current
  })
  //监听errors的变化
  storeFactory((s) => s.formStore.errors[prop])
}
