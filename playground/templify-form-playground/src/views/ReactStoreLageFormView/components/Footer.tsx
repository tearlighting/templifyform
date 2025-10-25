import { useLanguage } from "@/hooks/useLanguageReact"
import { Button, notification } from "antd"
import { useCallback, useEffect, useEffectEvent, useRef } from "react"
import { citys, useFormStore } from "../store"
import type { IFormTemplateItem } from "templify-form"
import clsx from "clsx"

export const Footer = () => {
  const { setLocale, currentLanguage } = useLanguage()

  const [api, contextHolder] = notification.useNotification()
  const {
    reset,
    setError,
    formStore: { formData, errors },
    setFormTemplate,
    setField,
  } = useFormStore()
  //手动监听表单数据变化
  const formDataRef = useRef(formData)
  useFormStore((s) => {
    const formData = s.formStore.formData
    for (let key in formData) {
      const keyWithType = key as keyof typeof formData
      if (formData[keyWithType] !== formDataRef.current[keyWithType]) {
        formDataRef.current = {
          ...formData,
        }
      }
    }
    return formDataRef.current
  })

  const isValid = useFormStore((s) => s.formStore.isValid)
  const country = useFormStore((s) => s.formStore.formData.country)

  useEffect(() => {
    setFormTemplate({
      city: ({ formTemplate }: { formTemplate: IFormTemplateItem<any, any, any>[] }) => {
        const item = formTemplate.find((item) => item.prop === "city")!
        const countryLower = country?.toLowerCase() as keyof typeof citys
        item.option = countryLower ? citys[countryLower] : citys["china"]
        const values = item.option.map((item) => item.value)
        if (!values.includes(formData.city)) {
          setField("city", "")
        }
        return item
      },
    })
  }, [country])

  const submitNotification = useEffectEvent(() => {
    api.open({
      message: "Success",
      description: JSON.stringify(formData),
      type: "success",
      duration: 2000,
    })
    console.log(formData)
  })
  const showErrors = useEffectEvent(() => {
    api.open({
      message: "Error",
      description: JSON.stringify(errors),
      type: "error",
      duration: 2000,
    })
  })

  const clear = useCallback(() => {
    reset({})
  }, [])

  return (
    <div className="flex items-center   flex-col ">
      {contextHolder}
      <div className="mb-5 w-100">
        <label className="inline-block w-30 text-right pr-5 mr-3">isValid</label>
        <Button size="large" type="primary" disabled={!isValid} onClick={submitNotification}>
          submit
        </Button>
        <Button size="large" type="primary" onClick={clear} className="ml-3">
          clear
        </Button>
        <Button size="large" type="primary" onClick={() => reset()} className="ml-3">
          reset
        </Button>
      </div>
      <div className="mb-5 w-100">
        <label className="inline-block w-30 text-right pr-5 mr-3">setError</label>
        <Button size="large" type="primary" onClick={() => setError("code", "manual error")}>
          setError
        </Button>
        <Button size="large" className="ml-3" type="primary" disabled={isValid} onClick={showErrors}>
          errors
        </Button>
      </div>
      <div className="mb-5 w-100">
        <label className="inline-block w-30 text-right pr-5 mr-3">Language </label>
        <Button size="large" type="primary" className={clsx(currentLanguage === "zh" && "isActive")} onClick={() => setLocale("zh")}>
          中文
        </Button>
        <Button size="large" type="primary" className={clsx(currentLanguage === "jp" && "isActive", "ml-3")} onClick={() => setLocale("jp")}>
          日本語
        </Button>
        <Button size="large" type="primary" className={clsx(currentLanguage === "en" && "isActive", "ml-3")} onClick={() => setLocale("en")}>
          English
        </Button>
      </div>
    </div>
  )
}
